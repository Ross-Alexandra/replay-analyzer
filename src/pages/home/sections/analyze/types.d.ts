interface AnalyzeProps extends Omit<React.HTMLProps<HTMLDivElement>, 'as'> {
    currentStage: InputStages;
    setStage: (stage: InputStages) => void;
    roundData: Round[];
}