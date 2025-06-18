import * as React from 'react';
import styles from './NewsEventsGallery.module.scss';
import type { INewsEventsGalleryProps } from './INewsEventsGalleryProps';
import CardNewsAndEvents from './CardNewsAndEvents/CardNewsAndEvents';
import CardGallery from './CardGallery/CardGallery.cmp';

export default class NewsEventsGallery extends React.Component<INewsEventsGalleryProps, {}> {
  public render(): React.ReactElement<INewsEventsGalleryProps> {

    return (
      <div className={styles.Container}>

        <section dir='rtl' className={styles.mainSection}>
          <div className={styles.ContainerNews}>
            <CardNewsAndEvents {...this.props} />
          </div>
          <div className={styles.ContainerGallery}>
            <CardGallery {...this.props} />
          </div>

        </section>
      </div>
    );
  }
}
