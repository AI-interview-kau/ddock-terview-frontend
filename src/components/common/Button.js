import styled from 'styled-components';

const Button = styled.button`
  padding: ${({ $size = 'medium', theme }) => {
    switch ($size) {
      case 'small':
        return `${theme.spacing.sm} ${theme.spacing.md}`;
      case 'large':
        return `${theme.spacing.lg} ${theme.spacing.xl}`;
      default:
        return `${theme.spacing.md} ${theme.spacing.lg}`;
    }
  }};

  font-size: ${({ $size = 'medium', theme }) => {
    switch ($size) {
      case 'small':
        return theme.fonts.size.sm;
      case 'large':
        return theme.fonts.size.lg;
      default:
        return theme.fonts.size.base;
    }
  }};

  font-weight: ${({ theme }) => theme.fonts.weight.semibold};

  background-color: ${({ $variant = 'primary', theme }) => {
    switch ($variant) {
      case 'outline':
        return 'transparent';
      case 'secondary':
        return theme.colors.backgroundLight;
      case 'ghost':
        return 'transparent';
      default:
        return theme.colors.primary;
    }
  }};

  color: ${({ $variant = 'primary', theme }) => {
    switch ($variant) {
      case 'outline':
        return theme.colors.primary;
      case 'ghost':
        return theme.colors.text.primary;
      default:
        return 'white';
    }
  }};

  border: ${({ $variant = 'primary', theme }) => {
    if ($variant === 'outline') {
      return `2px solid ${theme.colors.primary}`;
    }
    return 'none';
  }};

  border-radius: ${({ $rounded = false, theme }) =>
    $rounded ? theme.borderRadius.full : theme.borderRadius.lg};

  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};

    background-color: ${({ $variant = 'primary', theme }) => {
      switch ($variant) {
        case 'outline':
          return theme.colors.primary;
        case 'ghost':
          return 'rgba(255, 255, 255, 0.1)';
        default:
          return theme.colors.primaryDark;
      }
    }};

    color: ${({ $variant = 'primary' }) => {
      if ($variant === 'outline') {
        return 'white';
      }
      return 'inherit';
    }};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default Button;
