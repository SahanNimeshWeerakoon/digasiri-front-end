import {
    Button,
    Stack,
    Typography,
    // Chip,
} from '@mui/material';
import {Add} from '@mui/icons-material';
import TabComponent from '@/components/UI/TabComponent.tsx';
import TabAllCandidates from "@/components/Pages/Candidates/CandidatesBase/TabAllCandidates";
import TabCashflow from "@/components/Pages/Candidates/CandidatesBase/TabCashflow";
import TabQueueManager from "@/components/Pages/Candidates/CandidatesBase/TabQueueManager";
import TabApprovals from "@/components/Pages/Candidates/CandidatesBase/TabApprovals";
import {useNavigate} from "react-router";
import useAuth from "@/hooks/useAuth.ts";
import {userRoles} from "@/utils/globalVariables.ts";

export default function CandidatesBase() {
    const navigate = useNavigate();
    const {getUser} = useAuth();
    const user = getUser();

    const getUserAuthorizedTabs = () => {
        const all = {
            tab: {
                label: 'All Patients',
            },
            content: <TabAllCandidates/>
        }
        const liveq = {
            tab: {
                label: 'Live Queue Details',
            },
            content: <TabQueueManager/>
        }
        const cashflow = {
            tab: {
                label: 'Cash Flow',
            },
            content: <TabCashflow/>
        }
        const approvals = {
            tab: {
                label: 'Approvals',
                // icon: <Chip label="27" color="primary" size="small"/>,
                iconPosition: "end",
                sx: {minHeight: '48px'}
            },
            content: <TabApprovals/>
        }

        switch (user?.userData?.userRole) {
            case userRoles.receptionist:
                return [all, liveq, cashflow];

            case userRoles.doctor:
            case userRoles.nurse:
            case userRoles.labTech:
            case userRoles.pathologist:
            case userRoles.radiographer:
            case userRoles.radiologist:
                return [liveq, approvals];

            default:
                return [all, liveq, cashflow, approvals];
        }
    };

    const onRegister = () => navigate('/patients/register');

    const getUserAuthorizedActions = () => {
        if (user?.userData?.userRole === userRoles.receptionist || user?.userData?.userRole === userRoles.manager) {
            return <Button variant="contained" size="medium" onClick={onRegister} startIcon={<Add/>}>New
                Registration</Button>
        }
    }

    return (
        <>
            <Stack direction="row" sx={{
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
            }}>
                <Stack>
                    <Typography variant="h5">Registrations</Typography>
                    <Typography variant="body2" color="textSecondary">You will be able to view all the registrations
                        details</Typography>
                </Stack>
                {getUserAuthorizedActions()}
            </Stack>

            <TabComponent tabs={getUserAuthorizedTabs()}/>
        </>
    );
}