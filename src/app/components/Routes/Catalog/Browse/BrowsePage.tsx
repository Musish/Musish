import React, { useRef } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import translate from '../../../../utils/translations/Translations';
import PageContent from '../../../Common/PageContent/PageContent';
import PageTitle from '../../../Common/PageTitle/PageTitle';
import Tab from '../../../Common/Tabs/Tab';
import Tabs from '../../../Common/Tabs/Tabs';
import Genres from './Genres/Genres';
import TopCharts from './TopCharts/TopCharts';

type BrowsePageProps = RouteComponentProps;

const BrowsePage: React.FC<BrowsePageProps> = () => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <PageContent innerRef={ref}>
      <PageTitle title={`${translate.browse}`} context={`${translate.appleMusic}`} />

      <Tabs>
        <Tab name={`${translate.topCharts}`} route={'/browse'}>
          <TopCharts />
        </Tab>
        <Tab name={`${translate.genres}`} route={'/browse/genres'}>
          <Genres />
        </Tab>
      </Tabs>
    </PageContent>
  );
};

export default withRouter(BrowsePage);
