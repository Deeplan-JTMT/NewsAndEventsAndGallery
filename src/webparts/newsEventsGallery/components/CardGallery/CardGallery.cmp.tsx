import * as React from 'react';
import styles from './CardGallery.module.scss';
import { ISiteUserInfo } from '@pnp/sp/site-users/types';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { SPFI } from '@pnp/sp';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import 'animate.css';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './../Slider.css';
export interface CardGalleryProps {
  sp: SPFI;
  context: WebPartContext;
  TitleGallery: string;
  GalleryId: string;
}

export interface CardGalleryStates {
  Gallery: any[];
  CurrNewIndex: number;
  IsCurrPostLiked: boolean;
  CurrUser: ISiteUserInfo | undefined;
  slideDirection: string,
  forceRerender: boolean,
}

export default class CardGallery extends React.Component<CardGalleryProps, CardGalleryStates> {

  constructor(props: CardGalleryProps) {
    super(props);
    this.state = {
      Gallery: [],
      CurrNewIndex: 0,
      IsCurrPostLiked: false,
      CurrUser: undefined,
      slideDirection: 'right',
      forceRerender: false,
    }
  }

  componentDidMount(): void {
    this.getGallery()
  }

  getGallery = async () => {
    const siteName = this.props.context.pageContext.web.title;
    const items = await this.props.sp.web.getFolderByServerRelativePath(`/sites/${siteName}/Gallery`).files.expand("ListItemAllFields")()
      .then(items => items.filter((item: any) => item.ListItemAllFields.isDisplay)
        .sort((a: any, b: any) => a.ListItemAllFields.Index - b.ListItemAllFields.Index));


    this.setState({ Gallery: items })
  }

  onPictureConverterUrl = (Name: string): string => {
    return this.props.context.pageContext.web.absoluteUrl + "/Gallery/" + Name
  }

  handlePrevClick = (): void => {
    this.resetAnimation(() => {
      this.setState(prevState => ({
        CurrNewIndex: prevState.CurrNewIndex > 0 ? prevState.CurrNewIndex - 1 : prevState.Gallery.length - 1,
        slideDirection: 'left',
      }));
    });
  }

  // Add this method to handle the next button click
  handleNextClick = (): void => {
    this.resetAnimation(() => {
      this.setState(prevState => ({
        CurrNewIndex: prevState.CurrNewIndex < prevState.Gallery.length - 1 ? prevState.CurrNewIndex + 1 : 0,
        slideDirection: 'right',
      }));
    });
  }

  resetAnimation(callback: () => void) {
    this.setState({ forceRerender: !this.state.forceRerender }, () => {
      setTimeout(callback, 10); // Use a very short delay to trigger the re-render
    });
  }

  public render(): React.ReactElement<CardGalleryProps> {
    const { Gallery, CurrNewIndex, slideDirection } = this.state;
    const { TitleGallery } = this.props
    const animationClass = slideDirection === 'left' ? 'slideRight' : 'slideLeft';

    return (
      <div className={styles.mainContainer}>
        <h3 className={styles.GalleryTitle}>{TitleGallery}</h3>
        <div className={styles.GalleryCard}>
          {Gallery.length > 1 && <div className={styles.arrowLeft} onClick={this.handlePrevClick}>
            <NavigateBeforeIcon fontSize="large" />
          </div>}
          <TransitionGroup className={styles.GalleryImageContainer}>
            <CSSTransition
              key={CurrNewIndex}
              timeout={300} // Adjust based on your animation speed
              classNames={animationClass}
            >
              <a
                href={"https://jtmt.sharepoint.com/sites/JTMT/Gallery"}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkContainer} // מחלקה לקישורים
              >
                {!!Gallery.length && (
                  <>
                    {/* Prev */}
                    {CurrNewIndex > 0 && Gallery[CurrNewIndex - 1] && (
                      <img
                        style={{ opacity: 0 }}
                        src={this.onPictureConverterUrl(Gallery[CurrNewIndex - 1].Name)}
                        alt="previous"
                      />
                    )}

                    {/* Current */}
                    {Gallery[CurrNewIndex] && (
                      <img
                        src={this.onPictureConverterUrl(Gallery[CurrNewIndex].Name)}
                        alt="current"
                      />
                    )}

                    {/* Next */}
                    {CurrNewIndex < Gallery.length - 1 && Gallery[CurrNewIndex + 1] && (
                      <img
                        style={{ opacity: 0 }}
                        src={this.onPictureConverterUrl(Gallery[CurrNewIndex + 1].Name)}
                        alt="next"
                      />
                    )}
                  </>
                )}
              </a>
            </CSSTransition>
          </TransitionGroup>
          {Gallery.length > 1 && <div className={styles.arrowRight} onClick={this.handleNextClick}>
            <NavigateNextIcon fontSize="large" />
          </div>}
        </div>
      </div>
    );
  }
}