type ButtonType = 'primary' | 'secondary'| 'no-theme';

interface ButtonProps extends Omit<React.HTMLProps<HTMLButtonElement>, 'as'> {
    buttonType?: ButtonType;
}