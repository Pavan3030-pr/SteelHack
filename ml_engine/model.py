import torch
import torch.nn as nn
import torchvision.models as models

class SteelDefectCNN(nn.Module):
    """
    Industrial ResNet Backbone for 6-Class Steel Defect Classification
    Supports multi-task learning: Class category classification (Cross-Entropy) 
    and severity index percentage regression (MSE loss) in one unified model.
    """
    def __init__(self, num_classes: int = 6, pretrained: bool = True):
        super(SteelDefectCNN, self).__init__()
        
        # Load reliable pretrained ResNet-34/50 architecture for rapid hackathon deployment
        # Supports high performance, lightweight size for edge deploy (ONNX models)
        if pretrained:
            weights = models.ResNet34_Weights.DEFAULT
            self.backbone = models.resnet34(weights=weights)
        else:
            self.backbone = models.resnet34()
            
        in_features = self.backbone.fc.in_features
        
        # Replace the final linear model layer with a custom feature projection block
        self.backbone.fc = nn.Identity() # Delete standard classification head
        
        # Shared dense feature representation layer
        self.feature_extractor = nn.Sequential(
            nn.Linear(in_features, 512),
            nn.ReLU(inplace=True),
            nn.BatchNorm1d(512),
            nn.Dropout(p=0.4)
        )
        
        # Multi-task Head 1: Steel surface category prediction
        self.class_head = nn.Sequential(
            nn.Linear(512, 128),
            nn.ReLU(inplace=True),
            nn.Dropout(p=0.3),
            nn.Linear(128, num_classes)
        )
        
        # Multi-task Head 2: Defect severity index (fraction of surface affected, 0.0 to 100.0)
        self.severity_head = nn.Sequential(
            nn.Linear(512, 64),
            nn.ReLU(inplace=True),
            nn.Linear(64, 1),
            nn.Sigmoid() # Restrict output scale between 0.0 and 1.0 (Multiply by 100 on post-processing)
        )

    def forward(self, x: torch.Tensor):
        # Extract base convolutional features
        features = self.backbone(x)
        # Process through custom multi-task block
        shared_features = self.feature_extractor(features)
        
        # Generate predictions
        class_logits = self.class_head(shared_features)
        severity_prediction = self.severity_head(shared_features) * 100.0 # Scale to percent (0-100%)
        
        return class_logits, severity_prediction

if __name__ == "__main__":
    # Test tensor execution pass
    dummy_input = torch.randn(2, 3, 224, 224)
    model = SteelDefectCNN(num_classes=6, pretrained=False)
    logits, severity = model(dummy_input)
    print(f"Model validation check passed successfully!")
    print(f"Class output logits shape: {logits.shape} (Expected: [batch, 6])")
    print(f"Severity regression prediction shape: {severity.shape} (Expected: [batch, 1])")
