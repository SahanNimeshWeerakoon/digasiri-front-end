import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Autocomplete, Box,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Grid2,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import {CountryType, ICandidate} from '@/utils/types.ts';
import { countries } from '@/utils/globalVariables';
import useGlobalStore from "@/store/useGlobalStore.ts";
import { format } from "date-fns";

interface FormData extends ICandidate {
    passportConfirmation?: string;
}

export interface FormHandles {
    submit: () => void;
}

interface Candidate extends ICandidate {
    passportConfirmation: string;
}

interface Props {
    candidate: Candidate | null;
    onChange?: (data: Candidate) => void;
    onSubmit?: any;
}

const FormCandidateInformation = forwardRef<FormHandles, Props>(({
    candidate,
    onChange = () => {},
    onSubmit = () => {}
}, ref) => {
        const {
            watch,
            control,
            handleSubmit,
            formState: { errors }
        } = useForm<FormData>({
            defaultValues: {
                // Convert all null values to appropriate empty states
                firstName: candidate?.firstName || '',
                lastName: candidate?.lastName || '',
                dateOfBirth: candidate?.dateOfBirth || undefined,
                appointmentDate: candidate?.appointmentDate || undefined,
                nationality: candidate?.nationality || '',
                gender: candidate?.gender || '',
                profession: candidate?.profession || '',
                travellingTo: candidate?.travellingTo || '',
                maritalStatus: candidate?.maritalStatus || '',
                passportNumber: candidate?.passportNumber || '',
                passportIssueDate: candidate?.passportIssueDate || undefined,
                passportExpDate: candidate?.passportExpDate || undefined,
                passportIssuePlace: candidate?.passportIssuePlace || '',
                gamcaNumber: candidate?.gamcaNumber || '',
                phone: candidate?.phone || '',
                visaType: candidate?.visaType || '',
                agencyName: candidate?.agencyName || '',
                agencyNumber: candidate?.agencyNumber || 0,
                email: candidate?.email || '',
                nic: candidate?.nic || '',
                other: candidate?.other || '',
                passportConfirmation: candidate?.passportConfirmation || '',
            }
        });

        // Expose submit function to parent
        useImperativeHandle(ref, () => ({
            submit: () => {
                handleSubmit(onSubmit)();
            }
        }));

        const countriesList = useGlobalStore((state: any) => state.countries);

        const formValues = watch();

        useEffect(() => {
            const fingerPrintPath = candidate?.fingerPrintPath;
            const subscription = watch((updatedValues) => {
                const { passportConfirmation, ...candidate }: any = updatedValues;
                onChange({...candidate, fingerPrintPath});
            });

            return () => subscription.unsubscribe();
        }, [watch, onChange]);

        const preventCopyPaste = (e: React.ClipboardEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
        };

        return (
            <form>
                <Grid2 container spacing={2.5}>
                    {/* First Name */}
                    <Grid2 size={4}>
                        <Controller
                            name="firstName"
                            control={control}
                            rules={{ required: 'First Name is required' }}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    required
                                    label="First Name"
                                    error={!!errors.firstName}
                                    helperText={errors.firstName?.message}
                                    {...field}
                                    variant="outlined"
                                />
                            )}
                        />
                    </Grid2>

                    {/* Last Name */}
                    <Grid2 size={4}>
                        <Controller
                            name="lastName"
                            control={control}
                            rules={{ required: 'Last Name is required' }}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    required
                                    label="Last Name"
                                    error={!!errors.lastName}
                                    helperText={errors.lastName?.message}
                                    {...field}
                                    variant="outlined"
                                />
                            )}
                        />
                    </Grid2>

                    {/* Date of Birth */}
                    <Grid2 size={4}>
                        <Controller
                            name="dateOfBirth"
                            control={control}
                            rules={{ required: 'Date of Birth is required' }}
                            render={({ field }) => (
                                <DatePicker
                                    sx={{ minWidth: '100%' }}
                                    label="Date of Birth"
                                    value={field?.value||undefined}
                                    onChange={field?.onChange}
                                    slotProps={{
                                        textField: {
                                            error: !!errors?.dateOfBirth,
                                            helperText: errors?.dateOfBirth?.message,
                                        },
                                    }}
                                />
                            )}
                        />
                    </Grid2>

                    {/* Appointment Date */}
                    <Grid2 size={6}>
                        <Controller
                            name="appointmentDate"
                            control={control}
                            rules={{ required: 'Appointment Date is required' }}
                            render={({ field }) => (
                                <DatePicker
                                    sx={{ minWidth: '100%' }}
                                    label="Appointment Date"
                                    value={field?.value||undefined}
                                    onChange={field?.onChange}
                                    slotProps={{
                                        textField: {
                                            error: !!errors?.appointmentDate,
                                            helperText: errors?.appointmentDate?.message,
                                        },
                                    }}
                                />
                            )}
                        />
                    </Grid2>

                    {/* Visited Date */}
                    <Grid2 size={6}>
                        <FormControl fullWidth>
                            <FormLabel>Visited Date</FormLabel>
                            <span>{candidate?.visitedDate ? format(candidate.visitedDate, 'dd/MM/yyyy') : ''}</span>
                        </FormControl>
                    </Grid2>

                    {/* Nationality */}
                    <Grid2 size={4}>
                        <Controller
                            name="nationality"
                            control={control}
                            rules={{ required: 'Nationality is required' }}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors?.nationality}>
                                    <Autocomplete
                                        sx={{ width: '100%' }}
                                        value={countries.find((item:CountryType) => item?.label === field?.value) || null}
                                        onChange={(_event: any, newValue:any) => {
                                            field.onChange(newValue?.label || '');
                                        }}
                                        options={countries}
                                        autoHighlight
                                        getOptionLabel={(option: any) => option?.label||''}
                                        renderOption={(props, option) => {
                                            const { key, ...optionProps } = props;
                                            return (
                                                <Box
                                                    key={key}
                                                    component="li"
                                                    sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                                    {...optionProps}
                                                >
                                                    <img
                                                        loading="lazy"
                                                        width="20"
                                                        srcSet={`https://flagcdn.com/w40/${option?.code.toLowerCase()}.png 2x`}
                                                        src={`https://flagcdn.com/w20/${option?.code.toLowerCase()}.png`}
                                                        alt=""
                                                    />
                                                    {option?.label} ({option?.code}) +{option?.phone}
                                                </Box>
                                            );
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                error={!!errors?.nationality}
                                                label="Nationality"
                                                slotProps={{
                                                    htmlInput: {
                                                        ...params.inputProps,
                                                        autoComplete: 'new-password', // disable autocomplete and autofill
                                                    },
                                                }}
                                            />
                                        )}
                                    />
                                    <FormHelperText>{errors?.nationality?.message}</FormHelperText>
                                </FormControl>
                            )}
                        />
                    </Grid2>

                    {/* Gender */}
                    <Grid2 size={4}>
                        <Controller
                            name="gender"
                            control={control}
                            rules={{ required: 'Gender is required' }}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors?.gender}>
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                        label="Gender"
                                        value={field?.value || ''}
                                        onChange={field?.onChange}
                                    >
                                        <MenuItem value="">Select</MenuItem>
                                        <MenuItem value="M">Male</MenuItem>
                                        <MenuItem value="F">Female</MenuItem>
                                    </Select>
                                    <FormHelperText>{errors?.gender?.message}</FormHelperText>
                                </FormControl>
                            )}
                        />
                    </Grid2>

                    {/* Vaccination */}
                    <Grid2 size={4}>
                        <Controller
                            name="vaccination"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <FormLabel>Vaccination</FormLabel>
                                    <RadioGroup row value={field.value} onChange={field.onChange}>
                                        <FormControlLabel value="none" control={<Radio />} label="None" />
                                        <FormControlLabel value="MMR" control={<Radio />} label="MMR" />
                                    </RadioGroup>
                                </FormControl>
                            )}
                        />
                    </Grid2>

                    {/* Profession */}
                    <Grid2 size={4}>
                        <Controller
                            name="profession"
                            control={control}
                            rules={{ required: 'Profession is required' }}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    label="Profession"
                                    error={!!errors.profession}
                                    helperText={errors.profession?.message}
                                    {...field}
                                    variant="outlined"
                                />
                            )}
                        />
                    </Grid2>

                    {/* Traveling To */}
                    <Grid2 size={4}>
                        <Controller
                            name="travellingTo"
                            control={control}
                            rules={{ required: 'Destination country is required' }}
                            render={({ field }) => (
                                // <FormControl fullWidth error={!!errors?.travellingTo}>
                                //     <Autocomplete
                                //         sx={{ width: '100%' }}
                                //         value={countries.find((item:CountryType) => item?.label === field?.value) || null}
                                //         onChange={(_event: any, newValue:any) => {
                                //             field.onChange(newValue?.label || '');
                                //         }}
                                //         options={countries}
                                //         autoHighlight
                                //         getOptionLabel={(option: any) => option?.label||''}
                                //         renderOption={(props, option) => {
                                //             const { key, ...optionProps } = props;
                                //             return (
                                //                 <Box
                                //                     key={key}
                                //                     component="li"
                                //                     sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                //                     {...optionProps}
                                //                 >
                                //                     <img
                                //                         loading="lazy"
                                //                         width="20"
                                //                         srcSet={`https://flagcdn.com/w40/${option?.code.toLowerCase()}.png 2x`}
                                //                         src={`https://flagcdn.com/w20/${option?.code.toLowerCase()}.png`}
                                //                         alt=""
                                //                     />
                                //                     {option?.label} ({option?.code}) +{option?.phone}
                                //                 </Box>
                                //             );
                                //         }}
                                //         renderInput={(params) => (
                                //             <TextField
                                //                 {...params}
                                //                 error={!!errors?.travellingTo}
                                //                 label="Nationality"
                                //                 slotProps={{
                                //                     htmlInput: {
                                //                         ...params.inputProps,
                                //                         autoComplete: 'new-password', // disable autocomplete and autofill
                                //                     },
                                //                 }}
                                //             />
                                //         )}
                                //     />
                                //     <FormHelperText>{errors?.travellingTo?.message}</FormHelperText>
                                // </FormControl>
                                <FormControl fullWidth error={!!errors?.travellingTo}>
                                    <InputLabel>Traveling To</InputLabel>
                                    <Select
                                        label="Traveling To"
                                        value={field?.value || ''}
                                        onChange={field?.onChange}
                                    >
                                        <MenuItem value=''>Select</MenuItem>
                                        {countriesList?.map((country: any) => (
                                            <MenuItem value={country?.id} key={country?.id}>{country?.name}</MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>{errors?.travellingTo?.message}</FormHelperText>
                                </FormControl>
                            )}
                        />
                    </Grid2>

                    {/* Marital Status */}
                    <Grid2 size={4}>
                        <Controller
                            name="maritalStatus"
                            control={control}
                            rules={{ required: 'Marital status is required' }}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors?.maritalStatus}>
                                    <InputLabel>Marital Status</InputLabel>
                                    <Select
                                        label="Marital Status"
                                        value={field?.value||''}
                                        onChange={field?.onChange}
                                    >
                                        <MenuItem value="">Select</MenuItem>
                                        <MenuItem value="Married">Married</MenuItem>
                                        <MenuItem value="Unmarried">Unmarried</MenuItem>
                                    </Select>
                                    <FormHelperText>{errors?.maritalStatus?.message}</FormHelperText>
                                </FormControl>
                            )}
                        />
                    </Grid2>

                    {/* Passport Number */}
                    <Grid2 size={4}>
                        <Controller
                            name="passportNumber"
                            control={control}
                            rules={{
                                required: 'Passport Number is required',
                                pattern: {
                                    value: /^[A-Z0-9]{6,12}$/,
                                    message: 'Invalid passport format'
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    label="Passport Number"
                                    error={!!errors.passportNumber}  // ✅ Proper boolean conversion
                                    helperText={errors.passportNumber?.message}
                                    onCopy={preventCopyPaste}
                                    onCut={preventCopyPaste}
                                    onPaste={preventCopyPaste}
                                    {...field}
                                />
                            )}
                        />
                    </Grid2>

                    {/* Confirm Passport Number */}
                    <Grid2 size={4}>
                        <Controller
                            name="passportConfirmation"
                            control={control}
                            rules={{
                                required: 'Passport confirmation is required',
                                validate: value => value === formValues.passportNumber || "Passport numbers must match"
                            }}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    label="Confirm Passport Number"
                                    error={!!errors.passportConfirmation}  // ✅ Proper boolean conversion
                                    helperText={errors.passportConfirmation?.message}
                                    onCopy={preventCopyPaste}
                                    onCut={preventCopyPaste}
                                    onPaste={preventCopyPaste}
                                    {...field}
                                />
                            )}
                        />
                    </Grid2>

                    {/* Passport Issue Date */}
                    <Grid2 size={4}>
                        <Controller
                            name="passportIssueDate"
                            control={control}
                            rules={{ required: 'Passport Issue Date is required' }}
                            render={({ field }) => (
                                <DatePicker
                                    sx={{ minWidth: '100%' }}
                                    label="Passport Issue Date"
                                    value={field?.value||undefined}
                                    onChange={field?.onChange}
                                    slotProps={{
                                        textField: {
                                            error: !!errors?.passportIssueDate,
                                            helperText: errors?.passportIssueDate?.message,
                                        },
                                    }}
                                />
                            )}
                        />
                    </Grid2>

                    {/* Passport Issue Place */}
                    <Grid2 size={4}>
                        <Controller
                            name="passportIssuePlace"
                            control={control}
                            rules={{ required: 'Passport Issue Place is required' }}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    label="Passport Issue Place"
                                    error={!!errors.passportIssuePlace}
                                    helperText={errors.passportIssuePlace?.message}
                                    {...field}
                                    variant="outlined"
                                />
                            )}
                        />
                    </Grid2>

                    {/* Passport Expiry Date */}
                    <Grid2 size={4}>
                        <Controller
                            name="passportExpDate"
                            control={control}
                            rules={{ required: 'Passport Expiry Date is required' }}
                            render={({ field }) => (
                                <DatePicker
                                    sx={{ minWidth: '100%' }}
                                    label="Passport Expiry Date"
                                    value={field?.value||undefined}
                                    onChange={field?.onChange}
                                    slotProps={{
                                        textField: {
                                            error: !!errors?.passportExpDate,
                                            helperText: errors?.passportExpDate?.message,
                                        },
                                    }}
                                />
                            )}
                        />
                    </Grid2>

                    {/* GAMCA Number */}
                    <Grid2 size={4}>
                        <Controller
                            name="gamcaNumber"
                            control={control}
                            rules={{
                                required: 'GAMCA Number is required',
                            }}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    label="GAMCA Number"
                                    error={!!errors.gamcaNumber}
                                    helperText={errors.gamcaNumber?.message}
                                    {...field}
                                    variant="outlined"
                                />
                            )}
                        />
                    </Grid2>

                    {/* Phone Number */}
                    <Grid2 size={4}>
                        <Controller
                            name="phone"
                            control={control}
                            rules={{
                                required: 'Phone Number is required',
                                pattern: {
                                    value: /^\+?[0-9\s-]{6,15}$/,
                                    message: 'Invalid phone number format'
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    error={!!errors.phone}
                                    helperText={errors.phone?.message}
                                    {...field}
                                    variant="outlined"
                                />
                            )}
                        />
                    </Grid2>

                    {/* Visa Type */}
                    <Grid2 size={4}>
                        <Controller
                            name="visaType"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    label="Visa Type"
                                    {...field}
                                    variant="outlined"
                                />
                            )}
                        />
                    </Grid2>

                    {/* Recruiting Agency */}
                    <Grid2 size={4}>
                        <Controller
                            name="agencyName"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    label="Recruiting Agency"
                                    {...field}
                                    variant="outlined"
                                />
                            )}
                        />
                    </Grid2>

                    {/* Agency Number */}
                    <Grid2 size={4}>
                        <Controller
                            name="agencyNumber"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    label="Agency Number"
                                    {...field}
                                    variant="outlined"
                                />
                            )}
                        />
                    </Grid2>

                    {/* Email */}
                    <Grid2 size={4}>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    type="email"
                                    label="Email"
                                    {...field}
                                    variant="outlined"
                                />
                            )}
                        />
                    </Grid2>

                    {/* National ID */}
                    <Grid2 size={4}>
                        <Controller
                            name="nic"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    label="National ID"
                                    {...field}
                                    variant="outlined"
                                />
                            )}
                        />
                    </Grid2>

                    {/* Other */}
                    <Grid2 size={12}>
                        <Controller
                            name="other"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    label="Other"
                                    multiline
                                    rows={2}
                                    variant="outlined"
                                    {...field}
                                />
                            )}
                        />
                    </Grid2>
                </Grid2>
            </form>
        );
    }
);

export default FormCandidateInformation;