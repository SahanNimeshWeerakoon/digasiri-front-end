import {
    Container,
    Paper,
    Typography,
    Grid2,
    Box,  Fab,
} from "@mui/material";
import {useParams} from "react-router";
import useCandidate from "@/hooks/useCandidate.ts";
import {useEffect, useState} from "react";
import {ICandidate} from "@/utils/types.ts";
import {differenceInYears} from 'date-fns';
import { Margin, usePDF } from 'react-to-pdf';
import {
    Download
} from '@mui/icons-material';

const medicalData = {
    center: "BUDAIR DIAGNOSTIC CENTER",
    contacts: ["+94112285253", "+94760627360", "+94771637075"],
    gccCode: "04/01/12",
    tokenNo: "OM 20",
    date: "11-02-2025",
    gamcaNo: "0292920202920392023",
    srNo: "7159",
    country: "OMAN",
    name: "ADHEESJA EWKFEKIJFD",
    dob: "26 Y",
    passportNo: "N99887766",
    profession: "KITCHEN TOOLS CLEANER",
    religion: "BUDDHISM",
    status: "SINGLE",
    sex: "M",
    agency: "JET ON TRAVELS, EDAKKARA",
    visaNo: "",
    visaDate: "",
    height: "167 cm",
    weight: "88 kg",
    bp: "N/A",
    eyesEars: "N/A",
    bloodGroup: "N/A",
    hb: "N/A",
    rbs: "N/A",
    creatinine: "N/A",
    vaccinations: ["MR"],
    pathology: {
        HIV: "N/A",
        HCV: "N/A",
        VDRL: "N/A",
        HBsAg: "N/A",
        TPHA: "N/A",
        Other: "N/A",
    },
    mobile: "998182822",
    amountReceived: "36000 LKR",
    address: "No.58, Ground Floor & No58 1/1, Basement Floor, Dharmapala Mawatha, Colombo-3, Sri Lanka",
};

function getAge(birthday:any) {
    // Ensure the birthday is in ISO format (YYYY-MM-DD)
    // const birthDate = parseISO(birthday);
    return differenceInYears(new Date(), birthday);
}

const MedicalReport = () => {
    const {id} = useParams();
    const {getCandidate} = useCandidate();
    const [Candidate, setCandidate] = useState<ICandidate|null>(null);

    const {toPDF, targetRef} = usePDF({filename: 'page.pdf',page: { margin: Margin.MEDIUM }});

    useEffect(() => {
        getCandidate(id).then((res:any) => {
            setCandidate(res);
        })
    }, [id]);

    return (
        <Container maxWidth="lg">
            <Box sx={{paddingBlock:1,maxWidth:864,marginInline: 'auto',position: 'absolute',zIndex:9999}}>
                <Fab color="primary" aria-label="add" onClick={() => toPDF()}>
                    <Download />
                </Fab>
            </Box>
            <Box ref={targetRef}>
                <Container maxWidth="md" style={{ marginTop: "20px", paddingBottom: "40px" }}>
                    {/* Header */}
                    <Paper style={{ padding: "20px", marginBottom: "20px" }}>
                        <Typography variant="h5" align="center" fontWeight="bold">
                            {medicalData.center}
                        </Typography>
                        <Typography variant="subtitle1" align="center">
                            {medicalData.address}
                        </Typography>
                        <Typography variant="subtitle2" align="center">
                            Contact: {medicalData.contacts.join(", ")}
                        </Typography>
                    </Paper>

                    {/* Patient Details */}
                    <Paper style={{ padding: "20px", marginBottom: "20px" }}>
                        <Grid2 container spacing={2}>
                            <Grid2 size={6}>
                                <Typography variant="body1"><strong>Name: </strong>{`${Candidate?.firstName} ${Candidate?.lastName}`}</Typography>
                                <Typography variant="body1"><strong>Passport No: </strong> {Candidate?.passportNumber}</Typography>
                                <Typography variant="body1"><strong>Age: </strong> {getAge(Candidate?.dateOfBirth)}</Typography>
                                <Typography variant="body1"><strong>Country: </strong> {Candidate?.nationality}</Typography>
                                <Typography variant="body1"><strong>Profession: </strong> {Candidate?.profession}</Typography>
                                <Typography variant="body1"><strong>Recruiting Agency: </strong> {Candidate?.agencyName}</Typography>
                            </Grid2>
                            <Grid2 size={6}>
                                <Typography variant="body1"><strong>Token: </strong> {Candidate?.slipNumber}</Typography>
                                <Typography variant="body1"><strong>GAMCA No: </strong> {Candidate?.gamcaNumber}</Typography>
                                <Typography variant="body1"><strong>Sex: </strong> {Candidate?.gender === "M" ? "Male":"Female"}</Typography>
                                <Typography variant="body1"><strong>Mobile: </strong> {Candidate?.phone}</Typography>
                            </Grid2>
                        </Grid2>
                    </Paper>

                    {/* Vaccinations */}
                    <Paper style={{ padding: "20px", marginBottom: "20px" }}>
                        <Typography variant="h6" sx={{marginBottom:1}}>Vaccinations</Typography>
                        <Typography variant="body1">{Candidate?.vaccination}</Typography>
                    </Paper>

                    {/* Payment Details */}
                    <Paper style={{ padding: "20px", marginBottom: "20px" }}>
                        <Typography variant="h6" sx={{marginBottom:1}}>Payment Information</Typography>
                        <Typography variant="body1"><strong>Amount Received:</strong> {medicalData.amountReceived}</Typography>
                    </Paper>
                </Container>
            </Box>
        </Container>
    );
};

export default MedicalReport;