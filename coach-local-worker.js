/* Inférence locale : aucun jeton API, aucun serveur d’inférence. */
let generator=null,loading=null;
async function load(){
 if(generator)return generator;
 if(!loading)loading=(async()=>{
  const {pipeline,env,TextStreamer}=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1');
  env.allowLocalModels=false;
  // Un seul thread WASM : fonctionne aussi sans les en-têtes COOP/COEP sur GitHub Pages.
  env.backends.onnx.wasm.numThreads=1;
  env.backends.onnx.wasm.proxy=false;
  const progress_callback=event=>{if(event.status==='progress')postMessage({type:'progress',file:event.file,loaded:event.loaded,total:event.total,progress:event.progress});else if(event.status==='initiate')postMessage({type:'loading',file:event.file})};
  const pipe=await pipeline('text-generation','onnx-community/Qwen3-0.6B-ONNX',{device:'wasm',dtype:'q8',progress_callback});
  generator={pipe,TextStreamer};return generator;
 })().catch(error=>{loading=null;throw error});
 return loading;
}
self.onmessage=async({data})=>{
 try{
  const {pipe,TextStreamer}=await load();
  if(data.type==='load'){postMessage({type:'ready'});return}
  if(data.type!=='generate')return;
  let text='',lastPost=0;
  const streamer=new TextStreamer(pipe.tokenizer,{skip_prompt:true,skip_special_tokens:true,callback_function:chunk=>{text+=chunk;const now=Date.now();if(now-lastPost>80){postMessage({type:'token',text});lastPost=now}}});
  const prompt=pipe.tokenizer.apply_chat_template(data.messages,{tokenize:false,add_generation_prompt:true,enable_thinking:false});
  const result=await pipe(prompt,{return_full_text:false,max_new_tokens:384,do_sample:false,repetition_penalty:1.1,streamer});
  const generated=result?.[0]?.generated_text;
  const final=typeof generated==='string'?generated:Array.isArray(generated)?generated.at(-1)?.content:text;
  postMessage({type:'done',text:final||text});
 }catch(error){postMessage({type:'error',message:String(error.message||error).slice(0,350)})}
};
