import { google } from 'googleapis';
import moment from 'moment';


export default async function googleWebsiteAnalytics() {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.googleAnalyticsKeyfile,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly']
  });
  
  const client = await auth.getClient();
  
  const analyticsreporting = google.analyticsreporting({
    version: 'v4',
    auth: client
  });
  
  const today = moment().format('YYYY-MM-DD');
  const startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
  const endDate = today;
  
  const request = {
    requestBody: {
      reportRequests: [
        {
          viewId: 'YOUR_VIEW_ID',
          dateRanges: [
            {
              startDate: startDate,
              endDate: endDate
            }
          ],
          metrics: [
            { expression: 'ga:sessions' },
            { expression: 'ga:users' },
            { expression: 'ga:pageviews' }
          ],
          dimensions: [
            { name: 'ga:date' },
            { name: 'ga:country' }
          ]
        }
      ]
    }
  };
  
  try {
    const response = await analyticsreporting.reports.batchGet(request);
    const report = response.data.reports[0];
    
    const headers = report.columnHeader.metricHeader.metricHeaderEntries.map(entry => entry.name);
    const dataRows = report.data.rows;
    
    console.log('Report Headers:', headers);
    console.log('Report Data:');
    dataRows.forEach(row => {
      const dimensions = row.dimensions.join(', ');
      const metrics = row.metrics[0].values.join(', ');
      console.log(`Dimensions: ${dimensions}, Metrics: ${metrics}`);
    });
  } catch (err) {
    console.error('Error retrieving data from Google Analytics:', err);
  }
}


