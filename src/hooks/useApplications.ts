import { useApplicationContext } from '../contexts/ApplicationContext';

export function useApplications() {
    return useApplicationContext();
}
