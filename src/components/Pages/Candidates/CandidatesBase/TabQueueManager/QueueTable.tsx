import {
    Chip,
    Paper,
    TableContainer,
    Button, Box, Avatar, IconButton, Stack
} from '@mui/material';
import { useState } from 'react';
import {useNavigate} from "react-router";
import {Visibility} from "@mui/icons-material";
import {DataGrid, GridColDef, GridColumnMenu, GridColumnMenuProps} from "@mui/x-data-grid";

import ModalFingerprintSearch from '@/components/Common/fingerprints/ModalFingerprintSearch';

import useAuth from "@/hooks/useAuth.ts";
import {userRoles} from "@/utils/globalVariables.ts";

interface Props {
    rows: any;
    columns: any;
    currentData: any;
    isLoading: boolean;
}

function CustomColumnMenu(props: GridColumnMenuProps) {
    return (
        <GridColumnMenu
            {...props}
            slots={{
                // Hide `columnMenuColumnsItem`
                columnMenuColumnsItem: null,
            }}
        />
    );
}

const QueueTable = ({
    rows,
    isLoading,
    currentData
}: Props) => {
    const [fingerprintModalOpen, setFingerprintMOdalOpen] = useState(false);

    const navigate = useNavigate();

    const viewCandidate = (id: any) => {
        navigate(`/patients/${id}`);
    }

    const {getUser} = useAuth();
    const user = getUser();

    const getUserAuthorizedTabs = () => {
        const basic: GridColDef[] = [
            {field: 'token', headerName: 'Token', flex:1},
            {
                field: 'name',
                headerName: 'Name',
                flex: 1,
                renderCell: (params) => {
                    return (
                        <Box sx={{display: 'flex', alignItems: 'center',columnGap: 1,height: '100%'}}>
                            <Avatar alt={params.row.name} src={params.row.avatar}/>
                            {params.row.name}
                        </Box>
                    )
                }
            },
            {
                field: 'gender',
                headerName: 'Gender',
                flex: 1,
                valueGetter: (_value: any, row: any) => {
                    return row.Candidate?.gender === 'M' ? "Male":"Female"
                },
            },
        ]

        const person: GridColDef[] = [
            {
                field: 'doctor',
                headerName: 'Doctor',
                flex: 1,
                valueGetter: (_value: any, row: any) => {
                    return `${row?.doctor || '-'}`
                }
            },
            {
                field: 'radiologist',
                headerName: 'Radiologist',
                flex: 1,
                valueGetter: (_value: any, row: any) => {
                    return `${row?.radiologist || '-'}`
                }
            },
            {
                field: 'pathologist',
                headerName: 'Pathologist',
                flex: 1,
                valueGetter: (_value: any, row: any) => {
                    return `${row?.pathologist || '-'}`
                }
            },
        ]

        const test: GridColDef[] = [
            {
                field: 'physical',
                headerName: 'Physical',
                flex: 1,
                renderCell: (params) => (
                    <Box sx={{display: 'flex', alignItems: 'center',columnGap: 1,height:'100%'}}>
                        <Chip label={params.row.physical ? "Done" : "Pending"} color={params.row.physical ? "success" : "default"} size="small" />
                    </Box>
                )
            },
            {
                field: 'blood',
                headerName: 'Blood',
                flex: 1,
                renderCell: (params) => (
                        <Box sx={{display: 'flex', alignItems: 'center',columnGap: 1,height:'100%'}}>
                            <Chip label={params.row.blood ? "Done" : "Pending"} color={params.row.blood ? "success" : "default"} size="small" />
                        </Box>
                    )
            },
            {
                field: 'lab',
                headerName: 'Lab',
                flex: 1,
                renderCell: (params) => (
                    <Box sx={{display: 'flex', alignItems: 'center',columnGap: 1,height:'100%'}}>
                        <Chip label={params.row.lab ? "Done" : "Pending"} color={params.row.lab ? "success" : "default"} size="small" />
                    </Box>
                )
            },
            {
                field: 'xray',
                headerName: 'Xray',
                flex: 1,
                renderCell: (params) => (
                    <Box sx={{display: 'flex', alignItems: 'center',columnGap: 1,height:'100%'}}>
                        <Chip label={params.row.xray ? "Done" : "Pending"} color={params.row.xray ? "success" : "default"} size="small" />
                    </Box>
                )
            },
        ];

        const report: GridColDef[] = [
            {
                field: 'xrayReport',
                headerName: 'Xray Report',
                flex: 1,
                renderCell: (params) => (
                    <Box sx={{display: 'flex', alignItems: 'center',columnGap: 1,height:'100%'}}>
                        <Chip label={params.row.xrayReport ? "Done" : "Pending"} color={params.row.xrayReport ? "success" : "default"} size="small" />
                    </Box>
                )
            },
            {
                field: 'bloodReport',
                headerName: 'Blood Report',
                flex: 1,
                renderCell: (params) => (
                    <Box sx={{display: 'flex', alignItems: 'center',columnGap: 1,height:'100%'}}>
                        <Chip label={params.row.bloodReport ? "Done" : "Pending"} color={params.row.bloodReport ? "success" : "default"} size="small" />
                    </Box>
                )
            },
        ]

        const profession: GridColDef[] = [
            {
                field: 'profession',
                headerName: 'Profession',
                flex: 1,
                valueGetter: (_value: any, row: any) => {
                    return `${row?.Candidate?.profession || ''}`
                },
            },
        ];

        const action: GridColDef[] = [
            {
                field: 'actions',
                headerName: 'Actions',
                flex: 1.5,
                valueGetter: (_value: any, row: any) => {
                    return {id: row.id}
                },
                renderCell: (params) => (
                    <>
                        <Stack direction="row" spacing={1} sx={{height:'100%',paddingBlock:1}}>
                            <IconButton aria-label="delete" size="medium" onClick={() => {
                                const {row} = params;
                                const {Candidate} = row;
                                viewCandidate(Candidate?.id);
                            }}>
                                <Visibility fontSize="inherit"/>
                            </IconButton>
                            {![userRoles.manager, userRoles.labTech, userRoles.pathologist, userRoles.radiologist].includes(user?.userData?.userRole) && <Button variant='contained' size='small' color='primary'
                                     onClick={() => setFingerprintMOdalOpen(true)}>
                                Enter Data
                            </Button>}
                        </Stack>
                    </>
                )
            },
        ];

        switch (user?.userData?.userRole) {
            case userRoles.receptionist:
                return [...basic,...test,...action];

            case userRoles.doctor:
            case userRoles.nurse:
            case userRoles.labTech:
            case userRoles.pathologist:
            case userRoles.radiographer:
            case userRoles.radiologist:
                return [...basic,...action];

            default:
                return [...basic,...profession,...person,...test,...report,...action];
        }
    };

    return (
        <TableContainer component={Paper} sx={{borderRadius: '0'}}>
            <DataGrid
                rows={rows}
                sx={{border: 0, "& .selected": { background: 'rgba(105,255,165,0.2)' }}}
                loading={isLoading}
                disableRowSelectionOnClick
                columns={getUserAuthorizedTabs()}
                hideFooterPagination
                getRowClassName={(params) => {
                    if(params.row.Candidate.id === currentData.current) return "selected";
                    return "";
                }}
                slots={{ columnMenu: CustomColumnMenu }}
            />
            
            <ModalFingerprintSearch
                open={fingerprintModalOpen}
                add={() => {  }}
                setOpen={setFingerprintMOdalOpen}
            />
        </TableContainer>
    );
}

export default QueueTable;