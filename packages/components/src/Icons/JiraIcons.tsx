import type { FC, SVGProps } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Bookmark, Minus, Plus, Search, Settings, Trash2, User, X } from 'lucide-react';

const styles = stylex.create({
  iconContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    verticalAlign: 'middle',
  },
});

export type JiraWorkType = 'EPIC' | 'STORY' | 'TASK' | 'BUG' | 'SUBTASK' | string;
export type JiraPriority = 'HIGHEST' | 'HIGH' | 'MEDIUM' | 'LOW' | 'LOWEST' | string;

export interface IssueIconProps extends SVGProps<SVGSVGElement> {
  type: JiraWorkType;
  size?: number;
  sx?: stylex.StyleXStyles;
}

export const IssueIcon: FC<IssueIconProps> = ({ type, size = 16, sx, className, ...props }) => {
  const normalizedType = String(type).toUpperCase();
  const sxProps = stylex.props(styles.iconContainer, sx);

  switch (normalizedType) {
    case 'EPIC':
      return (
        <span {...sxProps} className={className}>
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <rect width="16" height="16" rx="3" fill="#904ee2" />
            <path d="M9.5 2.5L4.5 9H8.5L7.5 13.5L12.5 7H8.5L9.5 2.5Z" fill="#ffffff" />
          </svg>
        </span>
      );

    case 'STORY':
      return (
        <span {...sxProps} className={className}>
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <rect width="16" height="16" rx="3" fill="#63ba3c" />
            <path
              d="M5 3.5C4.44772 3.5 4 3.94772 4 4.5V13L8 10.5L12 13V4.5C12 3.94772 11.5523 3.5 11 3.5H5Z"
              fill="#ffffff"
            />
          </svg>
        </span>
      );

    case 'TASK':
      return (
        <span {...sxProps} className={className}>
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <rect width="16" height="16" rx="3" fill="#4bade8" />
            <path
              d="M5 8L7.2 10.5L11.5 5.5"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      );

    case 'BUG':
      return (
        <span {...sxProps} className={className}>
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <rect width="16" height="16" rx="3" fill="#e5493a" />
            <circle cx="8" cy="8" r="3.2" fill="#ffffff" />
          </svg>
        </span>
      );

    case 'SUBTASK':
      return (
        <span {...sxProps} className={className}>
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <rect width="16" height="16" rx="3" fill="#0052cc" />
            <path
              d="M5 4.5V8.5C5 9.05228 5.44772 9.5 6 9.5H11M11 9.5L9 7.5M11 9.5L9 11.5"
              stroke="#ffffff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      );

    default:
      return (
        <span {...sxProps} className={className}>
          <Bookmark size={size} color="#3b82f6" />
        </span>
      );
  }
};

export interface PriorityIconProps extends SVGProps<SVGSVGElement> {
  priority: JiraPriority;
  size?: number;
  sx?: stylex.StyleXStyles;
}

export const PriorityIcon: FC<PriorityIconProps> = ({
  priority,
  size = 16,
  sx,
  className,
  ...props
}) => {
  const normalizedPriority = String(priority).toUpperCase();
  const sxProps = stylex.props(styles.iconContainer, sx);

  switch (normalizedPriority) {
    case 'HIGHEST':
      return (
        <span {...sxProps} className={className}>
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path
              d="M3.5 11.5L8 7L12.5 11.5M3.5 7.5L8 3L12.5 7.5"
              stroke="#e5493a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      );

    case 'HIGH':
      return (
        <span {...sxProps} className={className}>
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path
              d="M3.5 10L8 5.5L12.5 10"
              stroke="#ff5630"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      );

    case 'MEDIUM':
      return (
        <span {...sxProps} className={className}>
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path
              d="M3.5 6H12.5M3.5 10H12.5"
              stroke="#ffab00"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      );

    case 'LOW':
      return (
        <span {...sxProps} className={className}>
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path
              d="M3.5 6L8 10.5L12.5 6"
              stroke="#0065ff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      );

    case 'LOWEST':
      return (
        <span {...sxProps} className={className}>
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path
              d="M3.5 4.5L8 9L12.5 4.5M3.5 8.5L8 13L12.5 8.5"
              stroke="#2684ff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      );

    default:
      return (
        <span {...sxProps} className={className}>
          <Minus size={size} color="#64748b" />
        </span>
      );
  }
};

export interface FontIconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  sx?: stylex.StyleXStyles;
}

export const FontIcon: FC<FontIconProps> = ({ name, size = 16, color, className, sx }) => {
  const normalizedName = name.toLowerCase();
  const sxProps = stylex.props(styles.iconContainer, sx);

  // Check Jira Work Types
  if (normalizedName === 'flash' || normalizedName === 'epic') {
    return <IssueIcon type="EPIC" size={size} className={className} sx={sx} />;
  }
  if (normalizedName === 'bookmark' || normalizedName === 'story') {
    return <IssueIcon type="STORY" size={size} className={className} sx={sx} />;
  }
  if (normalizedName === 'task') {
    return <IssueIcon type="TASK" size={size} className={className} sx={sx} />;
  }
  if (normalizedName === 'bug') {
    return <IssueIcon type="BUG" size={size} className={className} sx={sx} />;
  }
  if (normalizedName === 'subtask') {
    return <IssueIcon type="SUBTASK" size={size} className={className} sx={sx} />;
  }

  // Check Jira Priorities
  if (normalizedName === 'double-up' || normalizedName === 'highest') {
    return <PriorityIcon priority="HIGHEST" size={size} className={className} sx={sx} />;
  }
  if (normalizedName === 'up-arrow' || normalizedName === 'high') {
    return <PriorityIcon priority="HIGH" size={size} className={className} sx={sx} />;
  }
  if (normalizedName === 'medium') {
    return <PriorityIcon priority="MEDIUM" size={size} className={className} sx={sx} />;
  }
  if (normalizedName === 'down-arrow' || normalizedName === 'low') {
    return <PriorityIcon priority="LOW" size={size} className={className} sx={sx} />;
  }
  if (normalizedName === 'double-down' || normalizedName === 'lowest') {
    return <PriorityIcon priority="LOWEST" size={size} className={className} sx={sx} />;
  }

  // Utility icons
  const iconColor = color || 'currentColor';
  let IconComponent: FC<{ size?: number; color?: string }> = Bookmark;

  switch (normalizedName) {
    case 'plus':
      IconComponent = Plus;
      break;
    case 'close':
    case 'x':
      IconComponent = X;
      break;
    case 'setting':
    case 'settings':
      IconComponent = Settings;
      break;
    case 'search':
      IconComponent = Search;
      break;
    case 'user':
    case 'account':
      IconComponent = User;
      break;
    case 'trash':
      IconComponent = Trash2;
      break;
    default:
      IconComponent = Bookmark;
      break;
  }

  return (
    <span {...sxProps} className={className}>
      <IconComponent size={size} color={iconColor} />
    </span>
  );
};
