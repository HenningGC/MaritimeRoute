// PortData.js
import Papa from 'papaparse';
import portsData from '../Data/ports.csv';

const parsedData = Papa.parse(portsData, {
  header: true,
  dynamicTyping: true,
});

export default parsedData.data;