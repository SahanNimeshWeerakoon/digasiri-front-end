import {
  useRef,
  useState,
  useEffect,
} from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
} from "@mui/material";
import toast from 'react-hot-toast';
import useFiles from '@/hooks/useFiles.ts'

import { FingerprintSelectHand } from "@/assets/icons";
import SelectFingerprintButton from './SelectFingerprintButton';
import {
  loadScript,
  fingerprintEmitter,
  initializeFingerprintSDK
} from "@/utils/globalFunctions";
import PendingDots from '@/components/UI/PendingDots';

interface Props {
  open:boolean;
  add: Function;
  patient?: any;
  isNew?: boolean;
  setOpen:Function;
  setPatient?: Function;
}

const ModalFingerprintSelect = ({
  open,
  patient,
  setOpen,
  setPatient
}: Props) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState("Select finger from a hand");
  
  const {uploadFiles} = useFiles();
  const scannerRef = useRef<any>(null);
  const currSelectedIdRef = useRef<string>("");

  const isLeft = (id: string) => id === "1" || id === "2" || id === "3" || id === "4" || id === "5";
  const isLeftSelected = () => {
    return selectedIds.includes("1") || selectedIds.includes("2") || selectedIds.includes("3") || selectedIds.includes("4") || selectedIds.includes("5")
  }
  const isRightSelected = () => {
    return selectedIds.includes("6") || selectedIds.includes("7") || selectedIds.includes("8") || selectedIds.includes("9") || selectedIds.includes("10")
  }

  const handleFingerprintAcquired = async (base64: string) => {
    try {
      const formData = new FormData();
      formData.append("image", base64);
      const res = await uploadFiles(formData);
      if(setPatient && res.imageUrl) {
        setPatient((prev: any) => {
          /*
          * candidate.fingerprintPath = [{id: 1, path: ""}, {id: 6, path: ""}]
          * candidate.fingerprintPath[0] = left
          * candidate.fingerprintPath[1] = right
          */
          let fingerPrintPath = prev.fingerPrintPath ?? [];
          console.log({ prev, path: prev.fingerPrintPath });

          if(isLeft(currSelectedIdRef.current)) {
            fingerPrintPath[0] = { id: currSelectedIdRef.current, path: res.imageUrl }
          } else {
            fingerPrintPath[1] = { id: currSelectedIdRef.current, path: res.imageUrl }
          }
          fingerPrintPath = fingerPrintPath;
          return {
            ...prev,
            fingerPrintPath
          }
        })
      }
    } catch(err) {
      console.log(err);
    }
  }

  const startScanning = async () => {
    const devices = await scannerRef.current.enumerateDevices();
    if(devices.length)
      await scannerRef.current.startAcquisition(5, devices[devices.length-1]);
    else
      toast.error("Fingerprint Scanner Not Found");
  }
  
  const removeFinger = (id: string) => {
    setSelectedIds((prev: string[]) => {
      let newIds = [...prev];

      if(isLeft(id)) newIds[0] = "";
      else newIds[1] = "";

      return newIds;
    });

    if(setPatient) {
      setPatient((prev: any) => {
        let fingerPrintPath = prev.fingerPrintPath ?? [];
        
        if(isLeft(id)) fingerPrintPath[0] = {id: 0, path: ""};
        else fingerPrintPath[1] = {id: 0, path: ""};

        return {
          ...prev,
          fingerPrintPath
        }
      });
    }
  }

  const addFinger = (id: string) => {
    currSelectedIdRef.current = id;
    setMessage("Scan finger from the device");
    startScanning();
  }

  const handleButtonClick = (id: string) => {
    if(selectedIds.includes(id)) {
      removeFinger(id);
    } else {
      setSelectedIds((prev) => {
        let newIds = [...prev]
        
        if(isLeft(id)) newIds[0] = id;
        else newIds[1] = id;

        console.log(newIds);
        
        return newIds;
      })
      console.log("test");
      addFinger(id);
    }
  }

  useEffect(() => {
    // Load skd for fingerprint and initialize sdk
    const loadScripts = async () => {
      await loadScript("/websdk.client.bundle.min.js");
      await loadScript("/fingerprint.sdk.min.js");
      initializeFingerprintSDK(scannerRef);
    };
    loadScripts();
  
    fingerprintEmitter.on("fingerprintAquired", handleFingerprintAcquired);
  
    return () => {
      fingerprintEmitter.off("fingerprintAquired", handleFingerprintAcquired);
    };
  }, []);

  useEffect(() => {
    if(patient?.fingerPrintPath) {
      let addedFingerprints = patient.fingerPrintPath;
      addedFingerprints = addedFingerprints.map((addedFingerprint: any) => addedFingerprint.id);
      if(addedFingerprints.length === 2) setMessage("Close");
      setSelectedIds(addedFingerprints);
    }
  }, [patient]);

  useEffect(() => {
    let addedFingerprints = []
    if(patient?.fingerPrintPath) {
      addedFingerprints = patient.fingerPrintPath;
    }
    // Both scanned
    if(addedFingerprints?.[0]?.id && addedFingerprints?.[1]?.id) {
      return setMessage("Close");
    }
    // Nothing selected or scanned
    if(!selectedIds[0] && !selectedIds[1] && !addedFingerprints?.[0]?.id && !addedFingerprints?.[1]?.id) return setMessage("Select a finger from a hand");
    // Only Left selected and not scanned
    if(selectedIds[0] && !addedFingerprints?.[0]?.id) return setMessage("Scan the finger from left hand");
    // Only Left selected and scanned
    if(!selectedIds[1] && selectedIds[0] && addedFingerprints?.[0]?.id) return setMessage("Select a finger from right hand");
    // Only Right selected and not scanned
    if(selectedIds[1] && !addedFingerprints?.[1]?.id) return setMessage("Scan the finger from right hand");
    // Only Right selected and scanned
    if(!selectedIds[0] && selectedIds[1] && !addedFingerprints?.[0]?.id) return setMessage("Select a finger from left hand");
  }, [patient, selectedIds]);

  const fingerIdList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

  return (
    <Dialog onClose={() => setOpen(false)} open={open} fullWidth maxWidth="sm">
      <DialogContent>
        <div>
          <h1>Add Fingerprint</h1>
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>
            {fingerIdList.map(id => (
              <Box key={id}>
                <SelectFingerprintButton
                  id={id}
                  isLeft={isLeft}
                  selectedIds={selectedIds}
                  isLeftSelected={isLeftSelected}
                  isRightSelected={isRightSelected}
                  handleButtonClick={handleButtonClick}
                />
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
              <FingerprintSelectHand selectedIds={selectedIds} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <Button onClick={() => {if(message == "Close") setOpen(false)}} sx={{ background: '#2E7D32', textAlign: 'center', gap: '10px', padding: '10px', borderRadius: '25px', width: '60%', margin: 'auto', color: 'white' }}>
              {message}
              {message.includes("Scan") ? <PendingDots /> : ""}
            </Button>
          </Box>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ModalFingerprintSelect;