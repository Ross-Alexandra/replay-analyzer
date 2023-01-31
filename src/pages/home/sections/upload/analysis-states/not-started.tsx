import { Button } from '../../../../../components';

interface NotStartedProps {
    processUploadedFiles: () => void;
}

export const NotStarted: React.FC<NotStartedProps> = ({
    processUploadedFiles
}) => 
    <Button buttonType='primary' onClick={processUploadedFiles}>
        <p>Process</p>
    </Button>
;