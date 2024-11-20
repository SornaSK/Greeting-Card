// Constants for validation
const CONSTRAINTS = {
    IMAGE_SIZE: { MIN: 10, MAX: 100 },
    FONT_SIZE: { MIN: 10, MAX: 50 },
    TEXT_LENGTH: { MAX: 100 }
};

// Utility functions for form validation
function showError(elementId, message) {
    const errorSpan = document.getElementById(elementId + 'Error');
    if (errorSpan) {
        errorSpan.textContent = message;
    }
    const inputElement = document.getElementById(elementId);
    if (inputElement) {
        inputElement.classList.add('input-error');
    }
}

function clearError(elementId) {
    const errorSpan = document.getElementById(elementId + 'Error');
    if (errorSpan) {
        errorSpan.textContent = '';
    }
    const inputElement = document.getElementById(elementId);
    if (inputElement) {
        inputElement.classList.remove('input-error');
    }
}

function clearAllErrors() {
    const errorElements = document.getElementsByClassName('error-message');
    Array.from(errorElements).forEach(element => {
        element.textContent = '';
    });
    const inputElements = document.getElementsByTagName('input');
    Array.from(inputElements).forEach(element => {
        element.classList.remove('input-error');
    });
}

function validateInput(value, min, max, fieldName, required = true) {
    if (required && (!value && value !== 0)) {
        throw new Error(`${fieldName} is required`);
    }
    if (value) {
        const num = parseInt(value);
        if (isNaN(num) || num < min || num > max) {
            throw new Error(`${fieldName} must be between ${min} and ${max}`);
        }
        return num;
    }
    return null;
}

function validateTextLength(text, maxLength, fieldName, required = true) {
    if (required && !text) {
        throw new Error(`${fieldName} is required`);
    }
    if (text && text.length > maxLength) {
        throw new Error(`${fieldName} must be less than ${maxLength} characters`);
    }
    return text;
}

// UI functions
function openCustomization() {
    document.getElementById('modal').style.display = 'flex';
}

function closeCustomization() {
    document.getElementById('modal').style.display = 'none';
    clearAllErrors();
}

function toggleBackgroundOptions() {
    const bgType = document.getElementById('bgType').value;
    const solidColorPicker = document.getElementById('solidColorPicker');
    const gradientPicker = document.getElementById('gradientPicker');

    if (bgType === 'solid') {
        solidColorPicker.style.display = 'table-row';
        gradientPicker.style.display = 'none';
    } else {
        solidColorPicker.style.display = 'none';
        gradientPicker.style.display = 'table-row';
    }
}

function calculateCardDimensions(greeting, message) {
    // Base dimensions
    let width = 300; // minimum width
    let height = 100; // minimum height

    // Calculate required width based on text length
    const greetingLength = greeting.length;
    const messageLength = message.length;
    const maxLength = Math.max(greetingLength, messageLength);

    // Adjust width based on text length
    if (maxLength > 30) {
        width = Math.min(600, width + (maxLength * 5));
    }

    // Adjust height based on message length (for line wrapping)
    const estimatedLines = Math.ceil(messageLength / (width / 15)); // rough estimate of chars per line
    height += estimatedLines * 30; // 30px per line

    // Add padding for greeting
    height += 80; // space for greeting

    // Ensure minimum dimensions
    width = Math.max(300, width);
    height = Math.max(100, height);

    // Cap maximum dimensions
    width = Math.min(600, width);
    height = Math.min(600, height);

    return { width, height };
}

function validateAndApply() {
    clearAllErrors();
    let isValid = true;

    try {
        // Validate required text inputs
        const greeting = document.getElementById('greetingInput').value;
        const message = document.getElementById('messageInput').value;

        try {
            validateTextLength(greeting, CONSTRAINTS.TEXT_LENGTH, 'Greeting');
            clearError('greetingInput');
        } catch (error) {
            showError('greetingInput', error.message);
            isValid = false;
        }

        try {
            validateTextLength(message, CONSTRAINTS.TEXT_LENGTH, 'Message');
            clearError('messageInput');
        } catch (error) {
            showError('messageInput', error.message);
            isValid = false;
        }

        // Validate image dimensions if image is uploaded
        const imageFile = document.getElementById('imageInput').files[0];
        if (imageFile) {
            const imageHeight = document.getElementById('imageHeightInput').value;
            const imageWidth = document.getElementById('imageWidthInput').value;

            try {
                validateInput(imageHeight, CONSTRAINTS.IMAGE_SIZE.MIN, CONSTRAINTS.IMAGE_SIZE.MAX, 'Image height');
                clearError('imageHeightInput');
            } catch (error) {
                showError('imageHeightInput', error.message);
                isValid = false;
            }

            try {
                validateInput(imageWidth, CONSTRAINTS.IMAGE_SIZE.MIN, CONSTRAINTS.IMAGE_SIZE.MAX, 'Image width');
                clearError('imageWidthInput');
            } catch (error) {
                showError('imageWidthInput', error.message);
                isValid = false;
            }
        }

        // If all validations pass, apply the changes
        if (isValid) {
            applyCustomizations();
        }

    } catch (error) {
        alert('Please fix the validation errors before applying changes.');
    }
}

function applyCustomizations() {
    const card = document.getElementById('card');
    const imageContainer = document.getElementById('imageContainer');

    // Get text content
    const greeting = document.getElementById('greetingInput').value;
    const message = document.getElementById('messageInput').value;

    // Calculate card dimensions based on text
    const dimensions = calculateCardDimensions(greeting, message);

    // Apply dimensions
    card.style.width = `${dimensions.width}px`;
    card.style.height = `${dimensions.height}px`;

    // Apply text content
    document.getElementById('greetingText').innerText = greeting;
    document.getElementById('messageText').innerText = message;

    // Apply background
    const bgType = document.getElementById('bgType').value;
    if (bgType === 'solid') {
        const color = document.getElementById('colorPicker').value;
        card.style.background = color;
    } else {
        const startColor = document.getElementById('gradientStart').value;
        const endColor = document.getElementById('gradientEnd').value;
        card.style.background = `linear-gradient(to bottom, ${startColor}, ${endColor})`;
    }

    // Apply text styling
    const textColor = document.getElementById('textColorPicker').value;
    const font = document.getElementById('fontSelect').value;
    const fontSize = document.getElementById('fontSize').value;

    document.getElementById('greetingText').style.color = textColor;
    document.getElementById('messageText').style.color = textColor;
    card.style.fontFamily = font;

    // Apply card shape
    const shape = document.getElementById('shapePicker').value;
    switch (shape) {
        case 'rectangle':
            card.style.borderRadius = '0';
            break;
        case 'rounded':
            card.style.borderRadius = '15px';
            break;
        case 'circle':
            card.style.borderRadius = '50%';
            break;
    }

    // Handle image upload
    const imageFile = document.getElementById('imageInput').files[0];
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imageContainer.style.backgroundImage = `url(${e.target.result})`;

            const imageHeight = document.getElementById('imageHeightInput').value;
            const imageWidth = document.getElementById('imageWidthInput').value;

            imageContainer.style.height = `${imageHeight}%`;
            imageContainer.style.width = `${imageWidth}%`;
        };
        reader.readAsDataURL(imageFile);
    }

    closeCustomization();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize background options
    toggleBackgroundOptions();
});

function downloadCard() {
    // Get the card element
    const card = document.getElementById('card');    
    card.classList.add('downloading');
    const options = {
        backgroundColor: null,
        scale: 2, // Higher quality
        useCORS: true,
        logging: false
    };
    
    // Convert the card to canvas
    html2canvas(card, options).then(canvas => {
        // Remove temporary class
        card.classList.remove('downloading');
        
        // Create download link
        const link = document.createElement('a');
        link.download = 'greeting-card.png';
        link.href = canvas.toDataURL('image/png');
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }).catch(error => {
        console.error('Error generating card image:', error);
        alert('There was an error downloading your card. Please try again.');
        card.classList.remove('downloading');
    });
}

const style = document.createElement('style');
style.textContent = `
    .downloading {
        transform: scale(1) !important;
        transform-origin: top left;
    }
`;
document.head.appendChild(style);
