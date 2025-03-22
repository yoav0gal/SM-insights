"use server";
import { AutoTokenizer, ModernBertModel } from "@huggingface/transformers";
import ndarray from "ndarray";

export async function getTextEmbedding(
  text: string
): Promise<ndarray.NdArray<any>> {
  const modelId = "answerdotai/ModernBERT-base";
  const tokenizer = await AutoTokenizer.from_pretrained(modelId);
  const model = await ModernBertModel.from_pretrained(modelId);

  const inputs = await tokenizer(text, {
    return_tensors: "pt",
    padding: true,
    truncation: true,
    max_length: 512,
  });

  // Get the underlying Float32Array from the logits tensor
  const output = await model(inputs);
  console.log(output);

  // const lastHiddenStateTensor = output.last_hidden_state.ort_tensor;
  // const lastHiddenStateData = lastHiddenStateTensor.cpuData[0];
  // const dims = lastHiddenStateTensor.dims;

  // console.log({ lastHiddenStateData, dims, lastHiddenStateTensor });

  const logitsTensor = output.logits.ort_tensor;
  const logitsData = logitsTensor.cpuData[0];
  const dims = logitsTensor.dims;

  console.log(logitsTensor.cpuData);
  console.log({ dims });
  console.log(logitsData);

  const outputTensor = ndarray(logitsTensor.cpuData, dims);
  console.log(outputTensor);
  // logitsTensor.cpuData.forEach((element, index) => {
  //   console.log(index, element);
  // });

  // Extract the CLS token embedding (assuming it is at sequence position 0)
  // The dimensions should now be [1, 512, 768] where 768 is the hidden size, and
  // 512 is the max tokens.

  // const hidden_size = dims[2];
  // const clsEmbedding = Array.from(lastHiddenStateData.subarray(0, dims[2]));

  // console.log({ hidden_size, clsEmbedding });

  // const clsEmbedding: number[] = logitsData.slice(0, hidden_size);

  return outputTensor;
}
