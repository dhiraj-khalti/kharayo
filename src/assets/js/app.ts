import confetti from 'canvas-confetti';
import Slot from '@js/Slot';
import SoundEffects from '@js/SoundEffects';

// Initialize slot machine
(() => {
  const drawButton = document.getElementById('draw-button') as HTMLButtonElement | null;
  const fullscreenButton = document.getElementById('fullscreen-button') as HTMLButtonElement | null;
  const settingsButton = document.getElementById('settings-button') as HTMLButtonElement | null;
  const settingsWrapper = document.getElementById('settings') as HTMLDivElement | null;
  const settingsContent = document.getElementById('settings-panel') as HTMLDivElement | null;
  const settingsSaveButton = document.getElementById('settings-save') as HTMLButtonElement | null;
  const settingsCloseButton = document.getElementById('settings-close') as HTMLButtonElement | null;
  const sunburstSvg = document.getElementById('sunburst') as HTMLImageElement | null;
  const confettiCanvas = document.getElementById('confetti-canvas') as HTMLCanvasElement | null;
  const nameListTextArea = document.getElementById('name-list') as HTMLTextAreaElement | null;
  const removeNameFromListCheckbox = document.getElementById('remove-from-list') as HTMLInputElement | null;
  const enableSoundCheckbox = document.getElementById('enable-sound') as HTMLInputElement | null;
  const backgroundImageInput = document.getElementById('background-image') as HTMLInputElement | null;
  const titleImageInput = document.getElementById('title-image') as HTMLInputElement | null;
  const removeBackgroundImageButton = document.getElementById('remove-background-image') as HTMLButtonElement | null;
  const removeTitleImageButton = document.getElementById('remove-title-image') as HTMLButtonElement | null;

  // Graceful exit if necessary elements are not found
  if (!(
    drawButton
    && fullscreenButton
    && settingsButton
    && settingsWrapper
    && settingsContent
    && settingsSaveButton
    && settingsCloseButton
    && sunburstSvg
    && confettiCanvas
    && nameListTextArea
    && removeNameFromListCheckbox
    && enableSoundCheckbox
    && backgroundImageInput
    && titleImageInput
    && removeBackgroundImageButton
    && removeTitleImageButton
  )) {
    console.error('One or more Element ID is invalid. This is possibly a bug.');
    return;
  }

  if (!(confettiCanvas instanceof HTMLCanvasElement)) {
    console.error('Confetti canvas is not an instance of Canvas. This is possibly a bug.');
    return;
  }

  const soundEffects = new SoundEffects();
  const MAX_REEL_ITEMS = 200;
  const CONFETTI_COLORS = ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'];
  let confettiAnimationId;

  /** Confeetti animation instance */
  const customConfetti = confetti.create(confettiCanvas, {
    resize: true,
    useWorker: true
  });

  /** Apply background image from localStorage */
  const applyBackgroundImage = () => {
    const storedImage = localStorage.getItem('background-image');

    if (storedImage) {
      document.body.style.backgroundImage = `url(${storedImage})`;
      document.body.style.backgroundSize = 'cover'; // Ensure the image covers the area
      document.body.style.backgroundPosition = 'center'; // Center the image
      document.body.style.backgroundRepeat = 'no-repeat'; // Prevent repeating the image
    }
  };
  // Run applyBackgroundImage on page load
  document.addEventListener('DOMContentLoaded', () => {
    applyBackgroundImage();
  });

  /** Apply title image from localStorage */
  const applyTitleImage = () => {
    const storedTitleImage = localStorage.getItem('title-image');

    // Select the .title element and cast it to HTMLElement
    const titleDiv = document.querySelector('.title') as HTMLElement;

    if (storedTitleImage && titleDiv) {
      titleDiv.style.backgroundImage = `url(${storedTitleImage})`;
      titleDiv.style.backgroundPosition = 'center'; // Center the image
      titleDiv.style.backgroundRepeat = 'no-repeat'; // Prevent repeating the image
    }
  };

  // Run applyTitleImage on page load
  document.addEventListener('DOMContentLoaded', () => {
    applyTitleImage();
  });

  /** Handle background image upload */
  if (backgroundImageInput) {
    backgroundImageInput.addEventListener('change', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files ? target.files[0] : null;

      if (file) {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
          const img = new Image();

          img.onload = () => {
          // Create a canvas to keep the original image size
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (ctx) {
            // Set canvas dimensions to the image's natural dimensions
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;

              // Draw the image onto the canvas
              ctx.drawImage(img, 0, 0);

              // Get the base64 image data
              const base64Image = canvas.toDataURL('image/png', 1); // Use maximum quality (1)

              // Store in localStorage
              try {
                localStorage.setItem('background-image', base64Image);
                console.log('Image stored in localStorage');
                applyBackgroundImage(); // Apply the background image immediately
              } catch (error) {
                console.log(error);
              }
            }
          };

          img.src = e.target?.result as string;
        };

        reader.readAsDataURL(file);
      }
    });
  }

  const removeBackgroundImage = () => {
    try {
    // Remove the image from localStorage
      localStorage.removeItem('background-image');
      console.log('Background image removed from localStorage');

      // Remove the background image from the body element
      document.body.style.backgroundImage = 'none'; // Clear the background image
      document.body.style.background = ''; // Clear any other background settings
    } catch (error) {
      console.error('Failed to remove background image from localStorage', error);
    }
  };
  // Call the function to remove the background image key

  // Click handler for "Remove Background Image" button for setting page
  removeBackgroundImageButton.addEventListener('click', removeBackgroundImage);

  /** Handle title image upload */
  if (titleImageInput) {
    titleImageInput.addEventListener('change', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files ? target.files[0] : null;

      if (file) {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
          const img = new Image();

          img.onload = () => {
          // Create a canvas to keep the original image size
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (ctx) {
            // Set canvas dimensions to the image's natural dimensions
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;

              // Draw the image onto the canvas
              ctx.drawImage(img, 0, 0);

              // Get the base64 image data
              const base64Image = canvas.toDataURL('image/png', 1); // Use maximum quality (1)

              // Store in localStorage
              try {
                localStorage.setItem('title-image', base64Image);
                console.log('Image stored in localStorage');
                applyTitleImage(); // Apply the background image immediately
              } catch (err) {
                console.error('Failed to store image in localStorage', err);
              }
            }
          };

          img.src = e.target?.result as string;
        };

        reader.readAsDataURL(file);
      }
    });
  }

  const removeTitleImage = () => {
    try {
      localStorage.removeItem('title-image');
      console.log('Title image key removed from localStorage');

      // Optionally, update the UI to reflect the change
      const titleDiv = document.querySelector('.title') as HTMLElement;
      if (titleDiv) {
        titleDiv.style.backgroundImage = 'none'; // Clear the background image
      }
    } catch (error) {
      console.error('Failed to remove Title image from localStorage', error);
    }
  };

  // Click handler for "Remove Logo" button for setting page
  removeTitleImageButton.addEventListener('click', removeTitleImage);

  /** Triggers cconfeetti animation until animation is canceled */
  const confettiAnimation = () => {
    const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
    const confettiScale = Math.max(0.5, Math.min(1, windowWidth / 1100));

    customConfetti({
      particleCount: 1,
      gravity: 0.8,
      spread: 90,
      origin: { y: 0.6 },
      colors: [CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]],
      scalar: confettiScale
    });

    confettiAnimationId = window.requestAnimationFrame(confettiAnimation);
  };

  /** Function to stop the winning animation */
  const stopWinningAnimation = () => {
    if (confettiAnimationId) {
      window.cancelAnimationFrame(confettiAnimationId);
    }
    sunburstSvg.style.display = 'none';
  };

  /**  Function to be trigger before spinning */
  const onSpinStart = () => {
    stopWinningAnimation();
    drawButton.disabled = true;
    settingsButton.disabled = true;
    soundEffects.spin((MAX_REEL_ITEMS - 1) / 10);
  };

  /**  Functions to be trigger after spinning */
  const onSpinEnd = async () => {
    confettiAnimation();
    sunburstSvg.style.display = 'block';
    await soundEffects.win();
    drawButton.disabled = false;
    settingsButton.disabled = false;
  };

  /** Slot instance */
  const slot = new Slot({
    reelContainerSelector: '#reel',
    maxReelItems: MAX_REEL_ITEMS,
    onSpinStart,
    onSpinEnd,
    onNameListChanged: stopWinningAnimation
  });

  /** To open the setting page */
  const onSettingsOpen = () => {
    nameListTextArea.value = slot.names.length ? slot.names.join('\n') : '';
    removeNameFromListCheckbox.checked = slot.shouldRemoveWinnerFromNameList;
    enableSoundCheckbox.checked = !soundEffects.mute;
    settingsWrapper.style.display = 'block';
  };

  /** To close the setting page */
  const onSettingsClose = () => {
    settingsContent.scrollTop = 0;
    settingsWrapper.style.display = 'none';
  };

  // Click handler for "Draw" button
  drawButton.addEventListener('click', () => {
    if (!slot.names.length) {
      onSettingsOpen();
      return;
    }

    slot.spin();
  });

  // Hide fullscreen button when it is not supported
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - for older browsers support
  if (!(document.documentElement.requestFullscreen && document.exitFullscreen)) {
    fullscreenButton.remove();
  }

  // Click handler for "Fullscreen" button
  fullscreenButton.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      return;
    }

    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  });

  // Click handler for "Settings" button
  settingsButton.addEventListener('click', onSettingsOpen);

  // Click handler for "Save" button for setting page
  settingsSaveButton.addEventListener('click', () => {
    slot.names = nameListTextArea.value
      ? nameListTextArea.value.split(/\n/).filter((name) => Boolean(name.trim()))
      : [];
    slot.shouldRemoveWinnerFromNameList = removeNameFromListCheckbox.checked;
    soundEffects.mute = !enableSoundCheckbox.checked;
    onSettingsClose();
  });

  // Click handler for "Discard and close" button for setting page
  settingsCloseButton.addEventListener('click', onSettingsClose);
})();
