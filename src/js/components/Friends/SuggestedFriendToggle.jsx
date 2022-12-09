import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import { renderLog } from '../../common/utils/logging';
import AppObservableStore from '../../common/stores/AppObservableStore';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import { smallButtonIfNeeded } from '../Style/friendStyles';


export default class SuggestedFriendToggle extends Component {
  constructor (props) {
    super(props);
    this.state = {
      addSuggestedFriendSent: false,
      voter: {
        we_vote_id: '',
      },
      voterIsSignedIn: false,
    };
  }

  componentDidMount () {
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onFriendStoreChange();
    this.onVoterStoreChange();
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onFriendStoreChange () {
    const { otherVoterWeVoteId } = this.props;
    this.setState({
      isFriend: FriendStore.isFriend(otherVoterWeVoteId),
    });
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    this.setState({
      voterIsSignedIn: voter.is_signed_in,
      voter,
    });
  }

  addSuggestedFriend = () => {
    const { askMode, otherVoterWeVoteId } = this.props;
    const { voterIsSignedIn } = this.state;
    let messageToFriendType = 'inviteFriend'; // default
    if (askMode) {
      messageToFriendType = 'askFriend';
    }
    // console.log('addSuggestedFriend');
    if (voterIsSignedIn) {
      const invitationMessage = FriendStore.getMessageToFriendQueuedToSave(messageToFriendType);
      FriendActions.friendInvitationByWeVoteIdSend(otherVoterWeVoteId, invitationMessage);
      this.setState({
        addSuggestedFriendSent: true,
      });
    } else {
      AppObservableStore.setShowSignInModal(true);
    }
  }

  render () {
    renderLog('SuggestedFriendToggle');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state) { return <div />; }
    const { askMode, displayFullWidth, inSideColumn, inviteAgain, lightModeOn, otherVoterWeVoteId } = this.props;
    const { addSuggestedFriendSent, isFriend, voter } = this.state;
    // console.log('SuggestedFriendToggle, otherVoterWeVoteId:', otherVoterWeVoteId, ', isFriend:', isFriend);
    const isLookingAtSelf = voter.we_vote_id === otherVoterWeVoteId;
    if (isLookingAtSelf) {
      // You should not be able to friend yourself
      // console.log('SuggestedFriendToggle, isLookingAtSelf');
      return <div />;
    }

    let sendInviteText = 'Add friend';
    let inviteSentText = 'Invite sent';
    if (isFriend) {
      sendInviteText = 'Is friend';
      inviteSentText = 'Is friend';
    } else if (askMode) {
      sendInviteText = 'Ask';
      inviteSentText = 'Sent';
    } else if (inviteAgain) {
      sendInviteText = 'Invite again';
      inviteSentText = 'Invite sent';
    } else if (inSideColumn) {
      sendInviteText = 'Add';
      inviteSentText = 'Sent';
    }
    return (
      <SuggestedFriendToggleWrapper displayFullWidth={displayFullWidth}>
        <Button
          // className={`issues-follow-btn issues-follow-btn__main issues-follow-btn__main--radius ${lightModeOn ? ' issues-follow-btn--white' : ' issues-follow-btn--blue'}`}
          color="primary"
          disabled={addSuggestedFriendSent || isFriend}
          fullWidth
          onClick={this.addSuggestedFriend}
          variant={`${lightModeOn ? 'outlined' : 'contained'}`}
          style={smallButtonIfNeeded()}
        >
          {addSuggestedFriendSent ? inviteSentText : sendInviteText}
        </Button>
      </SuggestedFriendToggleWrapper>
    );
  }
}
SuggestedFriendToggle.propTypes = {
  askMode: PropTypes.bool,
  displayFullWidth: PropTypes.bool,
  inSideColumn: PropTypes.bool,
  inviteAgain: PropTypes.bool,
  lightModeOn: PropTypes.bool,
  otherVoterWeVoteId: PropTypes.string.isRequired,
};

const SuggestedFriendToggleWrapper = styled('div', {
  shouldForwardProp: (prop) => !['displayFullWidth'].includes(prop),
})(({ displayFullWidth }) => (`
  white-space: nowrap;
  width: 100%;
  // margin-right: 12px;
  @media(min-width: 400px) {
    ${displayFullWidth ? 'width: 100%;' : 'width: fit-content;'}
    margin: 0;
  }
  @media(min-width: 520px) {
    margin: 0;
  }
`));
