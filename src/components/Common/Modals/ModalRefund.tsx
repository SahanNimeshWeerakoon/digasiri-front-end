import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Avatar, Typography, TextField, InputAdornment
} from "@mui/material";
import {useState} from "react";
import useAppointment from "@/hooks/useAppointment.ts";

interface Props {
    open: boolean;
    setOpen: any;
    name: string;
    passpoort: string | undefined;
    id: string | undefined;
    appointmentId: number | undefined;
    image: string | undefined;
}

export default function ModalScanFromPassport({open, setOpen, name, passpoort, id, appointmentId, image}: Props) {
    const [refund, setRefund] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const {editRefund} = useAppointment()

    const refundCandidate = async () => {
        setLoading(true);
        const result = await editRefund({
            appointmentId,
            refund
        });
        setLoading(false);
        if (!result) return null;
        setRefund(0);
        setOpen(false);
        return result;
    }

    return (
        <Dialog onClose={setOpen} open={open} maxWidth="sm">
            <DialogTitle>Refund</DialogTitle>
            <DialogContent>
                <Box sx={{minWidth: 500}}>
                    <Box sx={{display: "flex", alignItems: "center", columnGap: 2, marginBottom: 4}}>
                        <Avatar
                            alt={name}
                            src={image}
                            sx={{width: 56, height: 56}}
                        />
                        <Box>
                            <Typography variant="h6">{name}</Typography>
                            <Typography variant="body1">{`Passport | ${passpoort}`}</Typography>
                            <Typography variant="body1">{`ID | ${id}`}</Typography>
                        </Box>
                    </Box>
                    <TextField
                        fullWidth
                        label="Enter Amount"
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                            },
                        }}
                        value={refund}
                        onChange={(e) => {
                            setRefund(Number(e?.target?.value) ? Number(e?.target?.value) : 0);
                        }}
                        variant="outlined"/>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="text" color="primary" onClick={() => setOpen(false)}>Cancel</Button>
                <Button variant="contained" color="primary" loading={loading} onClick={refundCandidate}>Refund</Button>
            </DialogActions>
        </Dialog>
    )
}