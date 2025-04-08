import {
    Box, Button, Stack,
} from "@mui/material";
import {useParams} from "react-router";
import {ReactBarcode} from 'react-jsbarcode';
import {useState} from "react";

export default function GetQR() {
    const {id} = useParams();
    const [barcode, setBarcode] = useState(false);

    return <Stack sx={{marginTop: 2}}>
        <Stack direction="row">
            <Button variant="contained" color="secondary"
                    onClick={_e => setBarcode(state => !state)}>Print BarCode</Button>
        </Stack>
        <Box sx={{marginTop: 2}}>
            {barcode && <ReactBarcode value={String(id)}/>}
        </Box>
    </Stack>
}