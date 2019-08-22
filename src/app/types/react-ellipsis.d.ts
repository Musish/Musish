declare module 'react-lines-ellipsis/lib/html' {
  import * as React from 'react';

  interface ReactLinesEllipsisProps {
    /** Max lines allowed */
    maxLine: number;
    /** HTML string */
    unsafeHTML?: string;
    /** HTML string */
    ellipsisHTML?: string;
    /** Base for ellipsis */
    basedOn?: string;
    /** Ran when reflow happens */
    onReflow?: () => void;
  }

  class LinesEllipsis extends React.Component<ReactLinesEllipsisProps> {
    public static defaultProps?: ReactLinesEllipsisProps;
  }

  export default LinesEllipsis;
}
