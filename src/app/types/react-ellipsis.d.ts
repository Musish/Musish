declare module 'react-lines-ellipsis/lib/html' {
  import * as React from 'react';

  interface IReactLinesEllipsisProps {
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

  class LinesEllipsis extends React.Component<IReactLinesEllipsisProps> {
    public static defaultProps?: IReactLinesEllipsisProps;
  }

  export default LinesEllipsis;
}
