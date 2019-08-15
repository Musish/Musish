import React, { ReactNode, RefObject } from 'react';
import classes from './PageContent.scss';

interface IPageContentProps {
  innerRef: RefObject<HTMLDivElement>;
  children: ReactNode;
}

interface IPageContentState {
  mounted: boolean;
}

class PageContent extends React.Component<IPageContentProps, IPageContentState> {
  constructor(props: IPageContentProps) {
    super(props);

    this.state = {
      mounted: !this.props.innerRef,
    };
  }

  public componentDidMount() {
    const { innerRef } = this.props;

    if (innerRef) {
      this.setState({
        mounted: true,
      });
    }
  }

  public render() {
    const { innerRef, children} = this.props;
    const { mounted } = this.state;

    return (
      <div className={classes.pageContent} ref={innerRef}>
        {mounted && children}
      </div>
    );
  }
}

export default PageContent;
