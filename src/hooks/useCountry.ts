import CountryService from '@/api/country.ts';
import useGlobalStore from '@/store/useGlobalStore.ts';

export default function useCountry() {
    const setCountries = useGlobalStore((state: any) => state.setCountries);

    const getCountries = async () => {
        const response = await CountryService.getCountries();
        if (!response) return;
        setCountries(response?.countries);
        return response;
    }

    return {
      getCountries
    }
}