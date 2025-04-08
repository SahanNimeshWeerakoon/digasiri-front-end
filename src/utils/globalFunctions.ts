import EventEmitter from "events";

export const fingerprintEmitter = new EventEmitter();

export const initializeFingerprintSDK = (scannerRef: any) => {
  const global: any = window;
  if (global.Fingerprint) {
    scannerRef.current = new global.Fingerprint.WebApi();

    scannerRef.current.onDeviceConnected = (event: any) => {
      console.log("Device Connected:", event.deviceUid);
    };

    scannerRef.current.onDeviceDisconnected = (event: any) => {
      console.log("Device Disconnected:", event.deviceUid);
    };

    scannerRef.current.onSamplesAcquired = (event: any) => {
      const samples = JSON.parse(event.samples);
      fingerprintEmitter.emit("fingerprintAquired", `data:image/png;base64,${global.Fingerprint.b64UrlTo64(samples[0])}`);
    };

    scannerRef.current.onQualityReported = (event: any) => {
      console.log("Quality Report:", event.quality);
    };

    scannerRef.current.onErrorOccurred = (event: any) => {
      console.error("Error:", event.error);
    };
  } else {
    console.error("Fingerprint SDK not loaded!");
  }
};

export const loadScript = (src: string) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};