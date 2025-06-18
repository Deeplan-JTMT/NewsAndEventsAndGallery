import * as React from 'react';
import styles from './CardNewsAndEvents.module.scss';
import { Likes, Like, New, Link } from "./ICardNewsAndEvents"
import { ISiteUserInfo } from '@pnp/sp/site-users/types';
import { ICardNewsAndEventsProps } from './ICardNewsAndEvents';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Modal from '@mui/material/Modal';
// import Modal from './Modal'
import { Box, Button, Divider, Tooltip } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import LinkIcon from '@mui/icons-material/Link';
import './../Slider.css';

const style = {
  position: 'absolute' as 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  borderRadius: '5px',
  boxShadow: 24,
  // p: 40,
};
export interface ICardNewsAndEventsState {
  News: New[];
  CurrNewIndex: number;
  CurrUser: ISiteUserInfo | undefined;
  isContentExpanded: boolean;
  substringLength: number;
  slideDirection: string;
  forceRerender: boolean;
  isOpen: boolean;
  openModalId: number | null;
}

export default class CardNewsAndEvents extends React.Component<ICardNewsAndEventsProps, ICardNewsAndEventsState> {
  constructor(props: ICardNewsAndEventsProps) {
    super(props)
    this.state = {
      News: [],
      CurrNewIndex: 0,
      CurrUser: undefined,
      isContentExpanded: false,
      substringLength: 130,
      slideDirection: 'right',
      forceRerender: false,
      isOpen: false,
      openModalId: null
    }
  }

  componentDidUpdate(): void {
  }


  componentDidMount(): void {
    this.props.sp.web.currentUser()
      .then(async (user: any) => {
        this.setState({
          CurrUser: user
        }, this.getNews)

      })
      .catch((error: any) => {
        console.error("Error fetching news:", error);
        throw error;
        // Handle the error here, show a message, or perform other actions if needed.
      });
  }

  getNews = async (): Promise<string> => {
    const news: New[] = await this.props.sp.web.lists.getById(this.props.NewsListId)
      .items
      // .select("Picture", "ID", "NewsContent", "Link", "Title")
      .orderBy("SortByAppearanceOrder")
      .filter(`DoDisplay ne 'true'`)
      .top(this.props.NewsToShow)
      ();

    let filterdNews = news.filter(item => item?.Picture !== null || item?.Link !== null)

    this.setState({ News: filterdNews })

    return 'success';

  }

  onPictureConverterUrl = (imageFromSP: any): string => {

    const imageUrl = this.props.context.pageContext.web.absoluteUrl + "/Lists/News/Attachments/" +
      this.state.News[this.state.CurrNewIndex].ID + "/" + JSON.parse(imageFromSP)?.fileName
    return imageUrl
  }

  handlePrevClick = (): void => {
    this.resetAnimation(() => {
      this.setState(prevState => ({
        CurrNewIndex: prevState.CurrNewIndex > 0 ? prevState.CurrNewIndex - 1 : prevState.News.length - 1,
        slideDirection: 'left',
      }));
    });
  }

  // Add this method to handle the next button click
  handleNextClick = (): void => {
    this.resetAnimation(() => {
      this.setState(prevState => ({
        CurrNewIndex: prevState.CurrNewIndex < prevState.News.length - 1 ? prevState.CurrNewIndex + 1 : 0,
        slideDirection: 'right',
      }));
    });
  }

  resetAnimation(callback: () => void) {
    this.setState({ forceRerender: !this.state.forceRerender }, () => {
      setTimeout(callback, 10); // Use a very short delay to trigger the re-render
    });
  }

  // Add a new method to handle toggling the expanded state
  openModal = (id: number | null) => {
    this.setState({ openModalId: id })
  };

  handleCloseModal = () => {
    this.setState({ openModalId: null })
  }

  openUrl = (index: number) => {
    // Ensure the index is within the bounds of the News array and that the relevant properties exist
    const newsItem = this.state.News[index];
    if (newsItem && newsItem.Link && newsItem.Link.Url) {
      window.open(newsItem.Link.Url, "_blank"); // "_blank" to open in a new tab safely
    } else {
      console.error("URL is not available for this news item.");
    }
  }


  public render() {
    const { News, CurrNewIndex, slideDirection } = this.state;
    const animationClass = slideDirection === 'left' ? 'slideRight' : 'slideLeft'; // Ensure this is reflected in your CSS

    return (
      <div className={styles.mainContainer}>
        <h3 className={styles.newsTitle}>{this.props.TitleNews}</h3>
        <div className={styles.newsCard}>
          {News.length > 1 && <div className={styles.arrowLeft} onClick={this.handlePrevClick}>
            <NavigateBeforeIcon fontSize="large" />
          </div>}
          <TransitionGroup className={styles.newsImageContainer}>


            {News.length > 0 && (
              <CSSTransition
                key={CurrNewIndex}
                timeout={300}
                classNames={animationClass}
              >
                <img

                  src={this.onPictureConverterUrl(News[CurrNewIndex]?.Picture)}
                  alt="News Image"

                />
              </CSSTransition>
            )}
          </TransitionGroup>
          <div className={styles.newsContent}>
            <p>
              {!!News.length ? (

                News[CurrNewIndex]?.Title?.length < this.state.substringLength ? (

                  <span>{News[CurrNewIndex]?.Title} <span className={styles.readMore} onClick={() => this.openModal(CurrNewIndex)}> קרא עוד</span></span>

                ) : (
                  <Tooltip title={News[CurrNewIndex]?.Title}>
                    <span>
                      {News[CurrNewIndex]?.Title?.substring(0, this.state.substringLength)} ...
                      <span className={styles.readMore} onClick={() => this.openModal(CurrNewIndex)}>
                        קרא עוד
                      </span>
                    </span>
                  </Tooltip>
                )
              ) : (
                'No news content'
              )}
            </p>
          </div>
          {News.length > 1 && <div className={styles.arrowRight} onClick={this.handleNextClick}>
            <NavigateNextIcon fontSize="large" />
          </div>}
        </div>
        <Modal disableRestoreFocus open={this.state.openModalId === CurrNewIndex} onClose={this.handleCloseModal}>

          <Box sx={style}>
            <div className={styles.ModalContainer}>

              <TransitionGroup className={styles.newsImageContainer} style={{ display: 'flex' }}>
                {News.length > 0 && (
                  <CSSTransition
                    key={CurrNewIndex}
                    timeout={300}
                    classNames={animationClass}
                  >
                    <>
                      {/* Prev */}
                      {CurrNewIndex > 0 && News[CurrNewIndex - 1] && (
                        <img
                          style={{ opacity: 0 }}
                          src={this.onPictureConverterUrl(News[CurrNewIndex - 1]?.Picture)}
                          alt="previous"
                        />
                      )}

                      {News[CurrNewIndex] && (
                        <img className={styles.imgModal}
                          src={this.onPictureConverterUrl(News[CurrNewIndex]?.Picture)}
                          alt="News Image"
                        />)}

                      {/* Next */}
                      {CurrNewIndex < News.length - 1 && News[CurrNewIndex + 1] && (
                        <img
                          style={{ opacity: 0 }}
                          src={this.onPictureConverterUrl(News[CurrNewIndex + 1]?.Picture)}
                          alt="next"
                        />
                      )}
                    </>
                  </CSSTransition>
                )}
              </TransitionGroup>
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', padding: '2rem', gap: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>

                    <span style={{ fontWeight: 'bold' }}>{News[CurrNewIndex]?.Title}</span>
                    {News[CurrNewIndex] && News[CurrNewIndex].Link && News[CurrNewIndex].Link.Url ?
                      <Button variant="text" color="primary" onClick={() => this.openUrl(CurrNewIndex)}>

                        פתח מסמך
                        {/* <LinkIcon> </LinkIcon> */}
                      </Button> : null}

                  </div>
                  {News.length ? (

                    <>
                      <span>{News[CurrNewIndex]?.NewsContent}</span>
                    </>

                  ) : (
                    'No news content'
                  )}
                </div>
              </div>
            </div>

          </Box>
        </Modal>
        {/* <Modal open={}></Modal> */}
      </div>
    );
  }
}