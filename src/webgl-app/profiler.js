import { getGPUTier } from "detect-gpu";
import { GRAPHICS_HIGH, GRAPHICS_NORMAL } from "./constants";

const gpuTier = getGPUTier();

export default function profiler() {
  switch (gpuTier.tier) {
    case "GPU_DESKTOP_TIER_3":
    case "GPU_DESKTOP_TIER_2":
      return GRAPHICS_HIGH;
    case "GPU_DESKTOP_TIER_1":
    default:
      return GRAPHICS_NORMAL;
  }
}

export function getTier() {
  return gpuTier.tier;
}
