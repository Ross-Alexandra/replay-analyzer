import { Error } from './error';
import { NotStarted } from './not-started';
import { Pending } from './pending';
import { Success } from './success';

interface AnalysisStateProps {
    processUploadedFiles: () => void;
    analysisState: AnalysisState;
}

export const AnalysisState: React.FC<AnalysisStateProps> = ({
    processUploadedFiles,
    analysisState
}) => {
    switch (analysisState) {
        case 'not-started':
            return <NotStarted processUploadedFiles={processUploadedFiles}/>;
        case 'pending':
            return <Pending />;
        case 'success':
            return <Success />;
        case 'error':
        default:
            return <Error />;
    }
};
