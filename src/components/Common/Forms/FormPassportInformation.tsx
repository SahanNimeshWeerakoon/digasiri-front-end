import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    FormControl,
    FormHelperText,
    Grid2,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { ICandidate } from '@/utils/types.ts';

interface FormData extends ICandidate {
    passportConfirmation?: string;
}

export interface FormHandles {
    submit: () => void;
}

interface Props {
    candidate: ICandidate | null;
    onChange?: (data: ICandidate) => void;
    onSubmit?: (data: ICandidate) => void;
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
                nationality: candidate?.nationality || '',
                gender: candidate?.gender || '',
                passportNumber: candidate?.passportNumber || '',
                passportConfirmation: candidate?.passportNumber || '',
                passportIssueDate: candidate?.passportIssueDate || undefined,
                passportExpDate: candidate?.passportExpDate || undefined,
                passportIssuePlace: candidate?.passportIssuePlace || '',
                nic: candidate?.nic || '',
            }
        });

        // Expose submit function to parent
        useImperativeHandle(ref, () => ({
            submit: () => {
                handleSubmit(onSubmit)();
            }
        }));

        const formValues = watch();

        useEffect(() => {
            const subscription = watch((updatedValues) => {
                const { passportConfirmation, ...candidate }: any = updatedValues;
                onChange(candidate);
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
                                    defaultValue={field.value || null}
                                    value={field.value || null}
                                    onChange={(newValue) => field.onChange(newValue)}
                                    format="dd/MM/yyyy"
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

                    {/* Nationality */}
                    <Grid2 size={4}>
                        <Controller
                            name="nationality"
                            control={control}
                            rules={{ required: 'Nationality is required' }}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors?.nationality}>
                                    <InputLabel>Nationality</InputLabel>
                                    <Select
                                        label="Nationality"
                                        value={field?.value || ''}
                                        onChange={field?.onChange}
                                    >
                                        <MenuItem value="">Select</MenuItem>
                                        <MenuItem value="Sri lankan">Sri Lanka</MenuItem>
                                        <MenuItem value="India">India</MenuItem>
                                        <MenuItem value="Germany">Germany</MenuItem>
                                        <MenuItem value="Canada">Canada</MenuItem>
                                        <MenuItem value="Pakistan">Pakistan</MenuItem>
                                    </Select>
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
                                    defaultValue={field.value || null}
                                    value={field.value || null}
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
                                    defaultValue={field.value || null}
                                    value={field.value || null}
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
                </Grid2>
            </form>
        );
    }
);

export default FormCandidateInformation;