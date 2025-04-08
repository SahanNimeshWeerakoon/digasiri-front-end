import {Avatar, Breadcrumbs, Chip, Link, Skeleton, Stack, Typography} from "@mui/material";
import {Home} from "@mui/icons-material";
import {ICandidate} from "@/utils/types.ts";

interface Props {
    loading?: boolean;
    candidate: ICandidate | null;
    children?: React.ReactNode;
    isRegister?: boolean;
}

export default function CandidateHeader({loading = false, candidate, children, isRegister}: Props) {
    const loadingPlaceholder = (<>
        <Skeleton variant="rectangular" width={300} height={42} sx={{borderRadius: 6}}/>
        <Stack direction="row" spacing={1}>
            <Skeleton variant="rectangular" width={70} height={40} sx={{borderRadius: 6}}/>
            <Skeleton variant="rectangular" width={70} height={40} sx={{borderRadius: 6}}/>
            <Skeleton variant="rectangular" width={70} height={40} sx={{borderRadius: 6}}/>
        </Stack>
    </>);

    return (
        <Stack direction="row" sx={{
            justifyContent: "space-between",
            alignItems: "start",
            p: 2,
        }}>
            <Stack spacing={1}>
                <Breadcrumbs aria-label="breadcrumb" maxItems={2}>
                    <Link
                        underline="hover"
                        sx={{display: 'flex', alignItems: 'center'}}
                        color="inherit"
                        href="/patients"
                    >
                        <Home sx={{width: '1.2rem', height: '1.2rem'}}/>
                    </Link>
                    <Stack direction="row" spacing={1.2}>
                        <Typography sx={{color: 'text.primary', display: 'flex', alignItems: 'center'}}>
                            {isRegister ? 'Register Patient' : 'Patients'}
                        </Typography>
                    </Stack>
                </Breadcrumbs>
                {loading ? loadingPlaceholder : (<>
                    <Typography
                        variant="h4">{(candidate?.firstName && candidate?.lastName) ? `${candidate?.firstName} ${candidate?.lastName}` : 'Candidate Name'}</Typography>
                    <Stack direction="row" spacing={1} sx={{alignItems: 'center'}}>
                        <Avatar alt={`${candidate?.firstName} ${candidate?.lastName}`} src={candidate?.photoPath}/>
                        <Chip label={candidate?.nationality ? candidate?.nationality : 'Nationality'}/>
                        <Chip label={candidate?.passportNumber ? candidate?.passportNumber : 'Passport Number'}/>
                        <Chip label={candidate?.gender ? (candidate?.gender === "M" ? 'Male' : 'Female') : 'Gender'}/>
                    </Stack>
                </>)}
            </Stack>
            <Stack direction="row" spacing={1}>
                {children}
            </Stack>
        </Stack>
    );
}