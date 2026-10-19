/* Inférence locale : aucun jeton API, aucun serveur d’inférence. */
let gpuEngine=null,gpuMode=false;
let generator=null,loading=null,modelId='onnx-community/Qwen3-0.6B-ONNX';
async function load(){
 if(generator)return generator;
 if(!loading)loading=(async()=>{
  const {pipeline,env,TextStreamer}=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1');
  env.allowLocalModels=false;
  // Un seul thread WASM : fonctionne aussi sans les en-têtes COOP/COEP sur GitHub Pages.
  env.backends.onnx.wasm.numThreads=1;
  env.backends.onnx.wasm.proxy=false;
  const progress_callback=event=>{if(event.status==='progress')postMessage({type:'progress',file:event.file,loaded:event.loaded,total:event.total,progress:event.progress});else if(event.status==='initiate')postMessage({type:'loading',file:event.file})};
  const pipe=await pipeline('text-generation',modelId,{device:'wasm',dtype:'q8',progress_callback});
  generator={pipe,TextStreamer};return generator;
 })().catch(error=>{loading=null;throw error});
 return loading;
}
self.onmessage=async({data})=>{
 try{
  if(data.type==='probe'){
   const {prebuiltAppConfig}=await import('https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.85/+esm');
   const adapter=await self.navigator.gpu?.requestAdapter();
   postMessage({type:'probe',available:Boolean(adapter?.features.has('shader-f16')),models:['Qwen3-4B-q4f16_1-MLC','Qwen3-8B-q4f16_1-MLC'].every(id=>prebuiltAppConfig.model_list.some(m=>m.model_id===id))});return;
  }
  if(data.type==='load' &&['gpu4','gpu8'].includes(data.model)){
   const adapter=await self.navigator.gpu?.requestAdapter();
   if(!adapter||!adapter.features.has('shader-f16')){postMessage({type:'error',code:'GPU_UNAVAILABLE'});return}
   const {CreateMLCEngine,prebuiltAppConfig}=await import('https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.85/+esm');
   const id=data.model==='gpu8'?'Qwen3-8B-q4f16_1-MLC':'Qwen3-4B-q4f16_1-MLC';
   if(!prebuiltAppConfig.model_list.some(m=>m.model_id===id))throw Error('GPU model is not available in this engine version');
   gpuEngine=await CreateMLCEngine(id,{initProgressCallback:p=>postMessage({type:'progress',progress:p.progress*100})},{context_window_size:4096});
   gpuMode=true;postMessage({type:'ready'});return;
  }
  if(data.type==='generate'&&gpuMode){
   let text='',lastPost=0;
   const stream=await gpuEngine.chat.completions.create({messages:data.messages,stream:true,max_tokens:768,temperature:0,extra_body:{enable_thinking:false}});
   for await(const chunk of stream){text+=chunk.choices[0]?.delta.content||'';if(Date.now()-lastPost>80){postMessage({type:'token',text});lastPost=Date.now()}}
   postMessage({type:'done',text});return;
  }
  if(data.type==='load'&&data.model==='strong')modelId='onnx-community/Qwen3-1.7B-ONNX';
  const {pipe,TextStreamer}=await load();
  if(data.type==='load'){postMessage({type:'ready'});return}
  if(data.type!=='generate')return;
  let text='',lastPost=0;
  const streamer=new TextStreamer(pipe.tokenizer,{skip_prompt:true,skip_special_tokens:true,callback_function:chunk=>{text+=chunk;const now=Date.now();if(now-lastPost>80){postMessage({type:'token',text});lastPost=now}}});
  const prompt=pipe.tokenizer.apply_chat_template(data.messages,{tokenize:false,add_generation_prompt:true,enable_thinking:false});
  const result=await pipe(prompt,{return_full_text:false,max_new_tokens:(data.mode==='light'?320:640),do_sample:false,repetition_penalty:1.0,streamer});
  const generated=result?.[0]?.generated_text;
  const final=typeof generated==='string'?generated:Array.isArray(generated)?generated.at(-1)?.content:text;
  postMessage({type:'done',text:final||text});
 }catch(error){postMessage({type:'error',message:String(error.message||error).slice(0,350)})}
};
