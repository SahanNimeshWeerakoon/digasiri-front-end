import { create } from 'zustand'

const useGlobalStore = create((set) => ({
    countries: [],
    setCountries: (newCountries: any[]) => set({ countries: newCountries }),
    //
    allTests: [],
    setAllTests: (newTests: any[]) => set({ allTests: newTests }),
}))

export default useGlobalStore;