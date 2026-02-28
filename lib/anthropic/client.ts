// Anthropic SDK client — initialized here but only called when USE_REAL_API = true.
// With USE_REAL_API = false, this module is imported but the client is never used.
import Anthropic from "@anthropic-ai/sdk";
import { config } from "@/config";

export const anthropic = new Anthropic({
  apiKey: config.anthropic.apiKey,
});
