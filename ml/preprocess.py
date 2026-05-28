import cv2
import numpy as np
from loguru import logger
from typing import Tuple, Dict, Any

class SteelImagePreprocessor:
    """
    Industrial Preprocessing Pipeline for Steel Surface Plates.
    Uses edge-preserving filters and luminance scaling to highlight anomalies.
    """
    def __init__(self, target_size: Tuple[int, int] = (224, 224)):
        self.target_size = target_size

    def apply_bilateral_filter(self, img: np.ndarray) -> np.ndarray:
        """
        Bilateral filtering smooths background industrial noise (grainy metal structures)
        while strictly preserving high-contrast crack/scratch boundaries.
        """
        # d=9 (Pixel neighborhood), sigmaColor=75, sigmaSpace=75
        filtered = cv2.bilateralFilter(img, d=9, sigmaColor=75, sigmaSpace=75)
        return filtered

    def apply_clahe(self, img: np.ndarray) -> np.ndarray:
        """
        Contrast Limited Adaptive Histogram Equalization boosts local contrast limits,
        critical for revealing faint rolling defects or shadow patches under overhead lights.
        """
        # Ensure grayscale format
        if len(img.shape) == 3:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        else:
            gray = img.copy()
            
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        normalized = clahe.apply(gray)
        return normalized

    def estimate_defect_severity(self, raw_img: np.ndarray) -> Tuple[np.ndarray, float]:
        """
        Identifies defect areas using adaptive thresh and contour detection.
        Returns the processed segment image overlay and the defect severity percentage.
        """
        # Normalize and find grayscale representation
        gray = self.apply_clahe(raw_img)
        smoothed = self.apply_bilateral_filter(gray)
        
        # Adaptive Thresholding to capture irregular metal defects
        binary = cv2.adaptiveThreshold(
            smoothed, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY_INV, 11, 2
        )
        
        # Morphological opening/closing to purge camera noise
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
        cleaned = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
        cleaned = cv2.morphologyEx(cleaned, cv2.MORPH_OPEN, kernel)
        
        # Find structural contours mapping spatial defect footprints
        contours, h_tree = cv2.findContours(cleaned, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Overlay contours onto original colorized image placeholder for operator view
        overlay = cv2.cvtColor(smoothed, cv2.COLOR_GRAY2BGR)
        cv2.drawContours(overlay, contours, -1, (0, 0, 255), 2)
        
        # Calculate Total defect Area / Total canvas area to gauge severity percentage
        total_pixels = raw_img.shape[0] * raw_img.shape[1]
        defect_pixels = cv2.countNonZero(cleaned)
        
        severity_ratio = (defect_pixels / total_pixels) * 100.0
        
        return overlay, round(severity_ratio, 2)

    def pipeline(self, image_path: str) -> Dict[str, Any]:
        """
        Loads local file path and runs the full metal-grade inspection workflow.
        """
        logger.info(f"Loading steel slab frame: {image_path}")
        img = cv2.imread(image_path)
        if img is None:
            raise FileNotFoundError(f"Selected image stream file could not be read: {image_path}")
            
        # Standardize structural dims
        resized = cv2.resize(img, self.target_size)
        gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
        
        # Process individual indicators
        clahe_result = self.apply_clahe(gray)
        contour_mask, severity = self.estimate_defect_severity(resized)
        
        logger.success(f"Steel inspection complete. Estimated severity percentage: {severity}%")
        
        return {
            "original": resized,
            "grayscale": gray,
            "enhanced_contrast": clahe_result,
            "contours_overlay": contour_mask,
            "severity_pct": severity
        }

if __name__ == "__main__":
    # Test generation of mock canvas to verify cv2 linking is functional
    test_grad = np.random.randint(100, 200, (256, 256, 3), dtype=np.uint8)
    cv2.imwrite("test_sample.png", test_grad)
    
    preprocessor = SteelImagePreprocessor()
    res = preprocessor.pipeline("test_sample.png")
    print(f"Computer vision pipeline verified!")
    print(f"Original shape: {res['original'].shape}, Resulting Severity Scale: {res['severity_pct']}%")
    
    # Cleanup verification file
    import os
    if os.path.exists("test_sample.png"):
        os.remove("test_sample.png")
