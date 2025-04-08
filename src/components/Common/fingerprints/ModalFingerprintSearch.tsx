import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
} from "@mui/material";
import { useNavigate } from "react-router";
import toast, { Toaster } from 'react-hot-toast';

import CandidateService from '@/api/candidates.ts';
import { FingerprintSelectHand } from "@/assets/icons";
import SelectFingerprintButton from './SelectFingerprintButton';
import { loadScript, fingerprintEmitter, initializeFingerprintSDK } from "@/utils/globalFunctions";
import PendingDots from '@/components/UI/PendingDots';

interface Props {
  open:boolean;
  add: Function;
  isNew?: boolean;
  setOpen:Function;
}

const ModalFingerprintSearch = ({
  open,
  setOpen,
}: Props) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState("Select finger from a hand");
  const [matchedCandidateId, setMatchedCandidateId] = useState<null | number>(null);
  const selectedIdsRef = useRef<string[]>([]);

  const navigate = useNavigate();
  const scannerRef = useRef<any>(null);

  const isLeft = (id: string) => id === "1" || id === "2" || id === "3" || id === "4" || id === "5";
  const isLeftSelected = () => {
    return selectedIds.includes("1") || selectedIds.includes("2") || selectedIds.includes("3") || selectedIds.includes("4") || selectedIds.includes("5")
  }
  const isRightSelected = () => {
    return selectedIds.includes("6") || selectedIds.includes("7") || selectedIds.includes("8") || selectedIds.includes("9") || selectedIds.includes("10")
  }

  const handleFingerprintAcquired = async (base64: string) => {
    try {
      const response = await CandidateService.compareFingerPrints(base64.replace(/^data:image\/\w+;base64,/, ""), selectedIdsRef.current[0]);
      if(response.matched) {
        toast.success("Match Found");
        setMessage("View candidate");
        setMatchedCandidateId(response.id);
      } else {
        toast.error("No Match Found");
      }
    } catch(err) {
      console.log("4");
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

  const handleFingerButtonClick = (id: string) => {
    setMatchedCandidateId(null)
    setSelectedIds((prev: string[]) => {
      let idList = [...prev];
      if(idList.includes(id)) {
        setMessage("Select a finger")
        idList = idList.filter((prevId: string) => prevId!== id);
      } else {
        idList.push(id)
        startScanning()
        setMessage("Scan your finger")
      }
      return idList
    });
  }

  const redirectToCandidate = () => {
    navigate(`/patients/${matchedCandidateId}`)
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
    selectedIdsRef.current = selectedIds;
  }, [selectedIds]);

  const fingerIdList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const buttonStyle = { padding: '10px', borderRadius: '20px', width: '60%', margin: 'auto', gap: '10px' }

  return (
    <Dialog onClose={() => setOpen(false)} open={open} fullWidth maxWidth="sm">
      <DialogContent>
        <div>
          <h1>Search Fingerprint</h1>
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>
            {fingerIdList.map(id => (
              <Box key={id}>
                <SelectFingerprintButton
                  id={id}
                  isSearch={true}
                  isLeft={isLeft}
                  selectedIds={selectedIds}
                  isLeftSelected={isLeftSelected}
                  isRightSelected={isRightSelected}
                  handleButtonClick={handleFingerButtonClick}
                />
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
              <FingerprintSelectHand selectedIds={selectedIds} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <Button
              color='success'
              sx={buttonStyle}
              variant='contained'
              onClick={() => {
                if(matchedCandidateId)
                  redirectToCandidate();
              }}
            >{message} {message.includes("Scan") ? <PendingDots /> : ""}</Button>
          </Box>
        </div>
      </DialogContent>
      <Toaster />
    </Dialog>
  );
}

export default ModalFingerprintSearch;