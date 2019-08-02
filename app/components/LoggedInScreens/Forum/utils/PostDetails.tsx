import React, { Component } from "react";
import { Image, Text, View, TouchableOpacity, ScrollView } from "react-native";
import SinglePostDetailsComment from "./SinglePostDetailsComment";
import styles from "./../style";
import axios from "axios";
import SavePostComment from "./SavePostComment";
import PageHeader from "./../../SharedComponents/PageHeader";
import { GlobalContext } from "./../../../Context/GlobalContext";
import moment from "moment";
import "moment/locale/pl";

const like: any = require("./../../../../assets/images/like.png");
const comment: any = require("./../../../../assets/images/comment.png");

interface PostDetailsState {
  postTitle: string;
  postDesc: string;
  postVotes: any;
  postDate: string;
  authorId: number;
  authorName: string;
  authorEmail: string;
  authorPhotoPath: string;
  comments: any;
  commentMessage: string;
}

interface PostDetailsProps {
  postDetailsId: number;
  setShowPostDetails: any;
}

class PostDetails extends Component<PostDetailsProps, PostDetailsState> {
  constructor(props: PostDetailsProps) {
    super(props);
    this.state = {
      postTitle: "",
      postDesc: "",
      postVotes: 0,
      postDate: "",
      authorId: 0,
      authorName: "",
      authorEmail: "",
      authorPhotoPath: "",
      comments: [],
      commentMessage: ""
    };

    this.getPostById = this.getPostById.bind(this);
    this.savePostVote = this.savePostVote.bind(this);
    this.getPostComments = this.getPostComments.bind(this);
    this.saveComment = this.saveComment.bind(this);
    this.setCommentMessage = this.setCommentMessage.bind(this);
    this.clearCommentMessage = this.clearCommentMessage.bind(this);
  }

  setCommentMessage = (message: string): void => {
    this.setState({ commentMessage: message });
  };

  clearCommentMessage = (): void => {
    this.setState({ commentMessage: "" });
  };

  getPostById = (): void => {
    try {
      let API_URL = this.context.API_URL;
      let postId = this.props.postDetailsId;

      let that = this;

      axios
        .post(API_URL + "/api/getPostById", {
          postId: postId
        })
        .then(function(response) {
          if (response.data.status === "OK") {
            console.log(["response.data.result[0]", response.data.result[0]]);
            that.setState({
              postTitle: response.data.result[0].title,
              postDesc: response.data.result[0].description,
              postVotes: response.data.result[0].votes.length,
              postDate: response.data.result[0].created_at,
              authorId: response.data.result[0].users.id,
              authorName: response.data.result[0].users.name,
              authorEmail: response.data.result[0].users.email,
              authorPhotoPath: response.data.result[0].users.photo_path,
              comments: response.data.result[0].comments
            });
          }
        })
        .catch(function(error) {
          that.context.setAlert(
            true,
            "danger",
            "Wystąpił błąd z wyświetleniem szczegółów posta."
          );
        });
    } catch (e) {
      this.context.setAlert(
        true,
        "danger",
        "Wystąpił błąd z wyświetleniem szczegółów posta."
      );
    }
  };

  savePostVote = (): void => {
    let API_URL = this.context.API_URL;
    let userId = this.context.userData.id;
    let postId = this.props.postDetailsId;

    let that = this;

    if (userId != this.state.authorId) {
      axios
        .post(API_URL + "/api/savePostVote", {
          postId: postId,
          userId: userId
        })
        .then(function(response) {
          if (response.data.status === "OK") {
            that.context.setAlert(
              true,
              "success",
              "Dziękujemy za oddanie głosu."
            );
            that.getPostById();
          } else {
            that.context.setAlert(
              true,
              "danger",
              "Oddałaś już głos na ten post."
            );
          }
        })
        .catch(function(error) {
          that.context.setAlert(true, "danger", "Problem z oddaniem głosu.");
        });
    } else {
      that.context.setAlert(true, "danger", "Problem z oddaniem głosu.");
    }
  };

  getPostComments = (): void => {
    let API_URL = this.context.API_URL;
    let postId = this.props.postDetailsId;

    let that = this;

    axios
      .post(API_URL + "/api/getPostCommentsByPostId", {
        postId: postId
      })
      .then(function(response) {
        if (response.data.status === "OK") {
          that.setState({ comments: [] });
          that.setState({ comments: response.data.result });
        }
      })
      .catch(function(error) {
        that.context.setAlert(
          true,
          "danger",
          "Problem z wyświetleniem listy komentarzy."
        );
      });
  };

  checkIfUserAddedVote = (votes: any, userId: number) => {
    return new Promise(resolve => {
      let allowUserVote = true;

      votes.map((vote: any, i: number) => {
        //user add vote to comment in the past
        if (vote.user_id === userId) {
          allowUserVote = false;
        }
      });

      resolve(allowUserVote);
    });
  };

  saveCommentVote = async (
    commentId: number,
    commentAuthorId: number,
    votes: any
  ) => {
    let API_URL = this.context.API_URL;
    let userId = this.context.userData.id;

    let that = this;

    if (commentAuthorId && commentAuthorId !== userId) {
      let allowUserVote = await this.checkIfUserAddedVote(votes, userId);

      if (allowUserVote) {
        axios
          .post(API_URL + "/api/saveCommentVote", {
            commentId: commentId,
            userId: userId
          })
          .then(function(response) {
            console.log(response.data);
            if (response.data.status === "OK") {
              that.context.setAlert(
                true,
                "success",
                "Dziękujemy za oddanie głosu."
              );
              that.getPostComments();
            }
          })
          .catch(function(error) {
            that.context.setAlert(true, "danger", "Problem z zapisem głosu.");
          });
      } else {
        that.context.setAlert(
          true,
          "danger",
          "Oddałaś już głos na ten komentarz."
        );
      }
    } else {
      that.context.setAlert(
        true,
        "danger",
        "Nie możesz oddać głosu na swój komentarz."
      );
    }
  };

  saveComment = (postId: number, userId: number, body: string): void => {
    let API_URL = this.context.API_URL;
    let that = this;

    if (!body || postId === 0 || userId === 0) {
      that.context.setAlert(true, "danger", "Prosimy o uzupełnienie treści.");
    } else {
      axios.post(API_URL + "/api/addNotification", {
        type: "comment_for_your_forum_post",
        message: `Użytkowniczka ${this.context.userData.name} (${
          this.context.userData.email
        }) dodała komentarz do Twojego posta na forum.`,
        userId: this.state.authorId
      });

      axios
        .post(API_URL + "/api/savePostComment", {
          body: body,
          userId: userId,
          postId: postId
        })
        .then(function(response) {
          if (response.data.status === "OK") {
            that.getPostComments();

            that.context.setAlert(
              true,
              "success",
              "Twój komentarz został dodany."
            );
          }
        })
        .catch(function(error) {
          that.context.setAlert(
            true,
            "danger",
            "Problem z dodaniem komentarza."
          );
        });
    }
  };

  componentDidMount = (): void => {
    this.getPostById();
  };

  render() {
    const {
      postTitle,
      postDesc,
      postVotes,
      postDate,
      authorName,
      authorEmail,
      authorPhotoPath,
      comments,
      commentMessage
    } = this.state;
    const postDateConverted = moment(postDate).format("LLL");
    return (
      <React.Fragment>
        <View style={{ position: "relative" }}>
          <PageHeader
            boldText={postTitle}
            normalText={""}
            closeMethod={this.props.setShowPostDetails}
            closeMethodParameter={""}
          />

          <ScrollView>
            <View style={styles.postDetailsContainerPadding}>
              <View style={styles.postDetailsContainer}>
                <TouchableOpacity>
                  <Image
                    style={styles.image}
                    source={{
                      uri: authorPhotoPath
                    }}
                  />
                </TouchableOpacity>
                <View style={styles.postDetailsAuthorContainer}>
                  <Text style={styles.postDetailsAuthorContainerName}>
                    {authorName}
                  </Text>
                  <Text style={styles.postDetailsAuthorContainerEmail}>
                    {authorEmail}
                  </Text>
                </View>
              </View>
              <Text style={styles.postDetailsDesc}>{postDesc}</Text>
              <Text style={styles.postDetailsPostDate}>
                Utworzono: {postDateConverted}
              </Text>
              <View style={styles.postDetailsPostVoteContainer}>
                <View style={styles.postDetailsPostVoteWrapper}>
                  <Text style={styles.postDetailsPostVoteCount}>
                    {postVotes}
                  </Text>
                  <TouchableOpacity onPress={this.savePostVote}>
                    <Image
                      style={styles.postDetailsPostVoteImage}
                      resizeMode="contain"
                      source={like}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.postDetailsPostCommentCountWrapper}>
                  <Text style={styles.postDetailsPostCommentCountText}>
                    {comments.length}
                  </Text>
                  <TouchableOpacity>
                    <Image
                      style={styles.postDetailsPostVoteImage}
                      resizeMode="contain"
                      source={comment}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {comments.length > 0 ? (
                <Text style={styles.postDetailsPostCommentListHeader}>
                  Komentarze:
                </Text>
              ) : null}

              {comments.map((comment: any, i: number) => {
                return (
                  <SinglePostDetailsComment
                    API_URL={this.context.API_URL}
                    key={`SinglePostDetailsComment-${i}`}
                    comment={comment}
                    saveCommentVote={this.saveCommentVote}
                  />
                );
              })}
            </View>
            <SavePostComment
              saveComment={this.saveComment}
              postId={this.props.postDetailsId}
              user={this.context.userData}
              setCommentMessage={this.setCommentMessage}
              commentMessage={commentMessage}
              clearCommentMessage={this.clearCommentMessage}
            />
          </ScrollView>
        </View>
      </React.Fragment>
    );
  }
}
PostDetails.contextType = GlobalContext;
export default PostDetails;
