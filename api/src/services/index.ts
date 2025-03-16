import { getAllContest } from './contestFetcher'
import cron from 'node-cron'
// Schedule tasks using node-cron
export default function initializeScheduler() {
  //  fetch - every 6 hours
  // we can optimise it for better user experience using seperate api calls
  /**
    codeforces  # Every 3 hours
    leetcode    # Every 4 hours
    codechef    # Every 6 hours
*/

  cron.schedule('0 */6 * * *', getAllContest)

  // Fetch YouTube solutions - twice daily
  // cron.schedule('0 */12 * * *', fetchYouTubeSolutions)
}
