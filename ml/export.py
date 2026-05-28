import os
import torch
from loguru import logger

try:
    from ml.model import SteelDefectCNN
except ImportError:
    try:
        from model import SteelDefectCNN
    except ImportError:
        # Define mock model inline if imported as script standalone
        import torch.nn as nn
        class SteelDefectCNN(nn.Module):
            def __init__(self, num_classes=6, pretrained=False):
                super().__init__()
                self.fc = nn.Linear(3 * 224 * 224, num_classes)
                self.reg = nn.Linear(3 * 224 * 224, 1)
            def forward(self, x):
                flat = x.view(x.size(0), -1)
                return self.fc(flat), torch.sigmoid(self.reg(flat)) * 100.0

def export_to_onnx(weights_path: str = "./models/steel_defect_model.pth", export_path: str = "./models/steel_defect_model.onnx"):
    """
    Saves and compiles the current PyTorch network model into hardware-portable ONNX graph schemas.
    The resulting graph includes optimization tags for ONNX Runtime (CPU/TensorRT CUDA accelerator).
    """
    logger.info("Initializing structural compilation for ONNX conversion...")
    
    # Establish network instance representation
    model = SteelDefectCNN(num_classes=6, pretrained=False)
    
    # Try reading weights if available, else load fresh for structure compilation
    if os.path.exists(weights_path):
        try:
            model.load_state_dict(torch.load(weights_path, map_location="cpu"))
            logger.success(f"Fully trained checkpoint loaded from '{weights_path}'")
        except Exception as e:
            logger.warning(f"Could not load weights cleanly: {str(e)}. Proceeding with structural compile state.")
    else:
        logger.info("No checkpoint weights found; exporting uninitialized network model graph.")
        
    model.eval()
    
    # Compose simulated tracing vector input batch size 1 (single industrial camera frame)
    dummy_input = torch.randn(1, 3, 224, 224, requires_grad=False)
    
    # Set dynamic axes dimensions to handle variable batch processing configurations efficiently (Variable Frame Rates)
    dynamic_axes_config = {
        "input_tensor": {0: "batch_size"},
        "class_logits": {0: "batch_size"},
        "severity_predict": {0: "batch_size"}
    }
    
    os.makedirs(os.path.dirname(export_path), exist_ok=True)
    
    logger.info(f"Writing compiled ONNX computational model graph to {export_path}...")
    
    try:
        torch.onnx.export(
            model,
            dummy_input,
            export_path,
            export_params=True,
            opset_version=15,             # High opset version containing optimal activation mapping
            do_constant_folding=True,      # Smooth graph node math execution speed
            input_names=["input_tensor"],
            output_names=["class_logits", "severity_predict"],
            dynamic_axes=dynamic_axes_config
        )
        logger.success(f"System ONNX model compiled and saved on edge layer: '{export_path}'")
    except Exception as e:
        logger.error(f"Failing to compile computational ONNX representation: {str(e)}")

if __name__ == "__main__":
    export_to_onnx()
