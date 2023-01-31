import { Spinner } from '../../../../../components';

// Success state shouldn't exist for long,
// as the page should immediately change to
// the analyzing state.
// Thus show identical state to pending.
export const Success: React.FC = () => 
    <Spinner />
;