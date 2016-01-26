import { createStore } from 'utils/createStore';
import { shallowClone } from 'utils/object-utils';

const AppDispatcher = require('dispatcher/AppDispatcher');
const BallotConstants = require('constants/BallotConstants');

import service from 'utils/service';


let _civic_id = null;
let _ballot_store = {};
let _candidate_store = {};
let _ballot_order = [];

const MEASURE = 'MEASURE';
const CANDIDATE = 'CANDIDATE';

function addItemsToBallotStore (ballot_item_list) {
  ballot_item_list.forEach( ballot_item => {
    _ballot_store[ballot_item.we_vote_id] = shallowClone(ballot_item);
    _ballot_order.push(ballot_item.we_vote_id);
  });
}

function ballotItemIsMeasure (we_vote_id) {
  return _ballot_store[we_vote_id].kind_of_ballot_item === MEASURE;
}

const BallotAPIWorker = {
  voterBallotItemsRetrieveFromGoogleCivic: function (text_for_map_search, success ) {
    return service.get({
      endpoint: 'voterBallotItemsRetrieveFromGoogleCivic',
      query: { text_for_map_search }, success
    });
  },

  candidatesRetrieve: function (office_we_vote_id, success ) {
    return service.get({
      endpoint: 'candidatesRetrieve',
      query: { office_we_vote_id },
      success
    });
  },

  // get the ballot items
  voterBallotItemsRetrieve: function ( success ) {
    return service.get({
      endpoint: 'voterBallotItemsRetrieve',
      success
    });
  },

  positionOpposeCountForBallotItem: function (ballot_item_id, kind_of_ballot_item, success ) {
    return service.get({
      endpoint: 'positionOpposeCountForBallotItem',
      query: { ballot_item_id, kind_of_ballot_item },
      success
    });
  },

  // get measure support an opposition
  positionSupportCountForBallotItem: function (ballot_item_id, kind_of_ballot_item, success ) {
    return service.get({
      endpoint: 'positionSupportCountForBallotItem',
      query: { ballot_item_id, kind_of_ballot_item },
      success
    });
  },

  voterPositionRetrieve: function (we_vote_id, success ){
    return service.get({
      endpoint: 'voterPositionRetrieve',
      query: {
         ballot_item_we_vote_id: we_vote_id,
         kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      }, success
    });
  },

  voterStarStatusRetrieve: function ( we_vote_id, success ) {
    return service.get({
      endpoint: 'voterStarStatusRetrieve',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      }, success
    });
  },

  voterStopOpposingSave: function (we_vote_id, success ) {
    return service.get({
      endpoint: 'voterStopOpposingSave',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      }, success
    });
  },

  voterStarOnSave: function (we_vote_id, success ) {
    return service.get({
      endpoint: 'voterStarOnSave',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      }, success
    });
  },

  voterStarOffSave: function (we_vote_id, success ) {
    return service.get({
      endpoint: 'voterStarOffSave',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      }, success
    });
  },

  voterSupportingSave: function (we_vote_id, success ) {
    return service.get({
      endpoint: 'voterStarOffSave',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      }, success
    });
  },

  voterStopSupportingSave: function (we_vote_id, success ) {
    return service.get({
      endpoint: 'voterStopSupportingSave',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      }, success
    });
  },

  voterOpposingSave: function (we_vote_id, success ) {
    return service.get({
      endpoint: 'voterOpposingSave',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      }, success
    });
  },

  voterStopOpposingSave: function (we_vote_id, success ) {
    return service.get({
      endpoint: 'voterStopOpposingSave',
      query: {
        ballot_item_id: _ballot_store[we_vote_id].id,
        kind_of_ballot_item: _ballot_store[we_vote_id].kind_of_ballot_item
      }, success
    });
  }

};

const BallotStore = createStore({
  /**
   * initialize the ballot store with data, if no data
   * and callback with the ordered items
   * @return {Boolean}
   */
  initialize: function (callback) {
    var promiseQueue = [];
    var getOrderedBallotItems = this.getOrderedBallotItems.bind(this);

    if (!callback || typeof callback !== 'function')
      throw new Error('initialize must be called with callback');

    // Do we have the Ballot data stored in the browser?
    if (Object.keys(_ballot_store).length)
      return callback.call(getOrderedBallotItems());

    else {

      BallotAPIWorker
        .voterBallotItemsRetrieve ()
        .then( (res) => {

          addItemsToBallotStore (
            res.ballot_item_list
          );

          console.log( 'BallotStore:', _ballot_store );
          console.log( 'BallotOrder:', _ballot_order );

          _ballot_order.forEach( we_vote_id => {

            console.log('is', we_vote_id, 'measure?', ballotItemIsMeasure(we_vote_id));

            if ( ballotItemIsMeasure(we_vote_id) ) {
              promiseQueue
                .push(
                  BallotAPIWorker
                    .positionOpposeCountForBallotItem( we_vote_id )
                );

              promiseQueue
                .push(
                  BallotAPIWorker
                    .positionSupportCountForBallotItem( we_vote_id )
                );
            } else {

              promiseQueue
                .push(

                  BallotAPIWorker
                    .candidatesRetrieve ( we_vote_id )
                    .then( (response) => {
                      var cand_list = _ballot_store [
                        response.office_we_vote_id
                      ] . candidate_list = {};

                      response
                        .candidate_list
                          .forEach( function (candidate) {
                            cand_list[
                              candidate.we_vote_id
                            ] = shallowClone(candidate);


                            promiseQueue
                              .push (
                                BallotAPIWorker
                                  .positionOpposeCountForBallotItem (
                                    candidate.we_vote_id, CANDIDATE
                                  )
                                  .then( (res) =>
                                    _ballot_store [
                                      response.we_vote_id
                                    ] [
                                      candidate.we_vote_id
                                    ] . opposeCount = res.count
                                  )
                                );

                            promiseQueue
                              .push (
                                BallotAPIWorker
                                  .positionSupportCountForBallotItem (
                                    candidate.we_vote_id, CANDIDATE
                                  )
                                .then( (res) =>
                                  _ballot_store [
                                    response.we_vote_id
                                  ] [
                                    candidate.we_vote_id
                                  ] . supportCount = res.count
                                )
                              );
                          });
                    })
                );
            }
          });

          new Promise ( (resolve) => {
            var counted = [];
            var count = 0;

            var interval = setInterval ( () => {

              res.ballot_item_list.forEach( (item) => {
                var { we_vote_id } = item;

                item = _ballot_store [
                  we_vote_id
                ];

                if ( ballotItemIsMeasure(we_vote_id) && counted.indexOf(we_vote_id) < 0 ) {
                  count += 2;
                  counted.push(we_vote_id);
                }
                else
                  if ( item.candidate_list && counted.indexOf(we_vote_id) < 0 ) {
                    count += 1 + item.candidate_list.length * 2;
                    counted.push(we_vote_id);
                  }
              });

              if (count === promiseQueue.length) {
                clearInterval(interval);
                callback(getOrderedBallotItems());
                resolve();
              }

            }, 1);
          });
        });
    }
  },

  /**
   * get ballot ordered key array and ballots
   * @return {Object} ordered keys and store data
   */
  getOrderedBallotItems: function () {
      var temp = [];
      _ballot_order.forEach(we_vote_id => temp
          .push(shallowClone(_ballot_store[we_vote_id]))
      );
      return temp;
  },

  /**
   * return ballot item object by we_vote_id
   * @param  {String} we_vote_id for office or measure
   * @return {Object} office or measure
   */
  getBallotItemByWeVoteId: function (we_vote_id, callback) {
     callback(shallowClone(_ballot_store[we_vote_id]));
  },

  /**
   * return google_civic_election_id
   * @return {String} google_civic_election_id
   */
  getCivicId: function () {
     return _civic_id;
  },
});

AppDispatcher.register( action => {
  switch (action.actionType) {
    case BallotConstants.BALLOT_SUPPORT_ON:  // supportOnToAPI
      supportOnToAPI(action.we_vote_id);
      BallotStore.emitChange();
      break;
    case BallotConstants.BALLOT_SUPPORT_OFF:  // supportOffToAPI
      supportOffToAPI(action.we_vote_id);
      BallotStore.emitChange();
      break;
    case BallotConstants.BALLOT_OPPOSE_ON:  // opposeOnToAPI
      opposeOnToAPI(action.we_vote_id);
      BallotStore.emitChange();
      break;
    case BallotConstants.BALLOT_OPPOSE_OFF:  // opposeOffToAPI
      opposeOffToAPI(action.we_vote_id);
      BallotStore.emitChange();
      break;
    case BallotConstants.STAR_ON:  // starOnToAPI
      starOnToAPI(action.we_vote_id);
      BallotStore.emitChange();
      break;
    case BallotConstants.STAR_OFF:  // starOffToAPI
      starOffToAPI(action.we_vote_id);
      BallotStore.emitChange();
      break;
  }
})

export default BallotStore;
