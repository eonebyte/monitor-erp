import axios from 'axios';

export const  fetchDueDates = async (query) => {
    try {
        const dueDatesRes = await axios.get(`http://localhost:3000/api/purchase/vendor-due-dates?${query}`);
        const dueDates = Array.isArray(dueDatesRes.data) ? dueDatesRes.data.map(duedate => ({
            document_no: duedate.documentno,
            grand_total: duedate.grandtotal,
            date_received: duedate.datereceived,
            payment_term_name: duedate.paymenttermname,
            duedate: duedate.duedate
        })) : [];
        return dueDates;
    } catch (error) {
        console.error("Error fetching data due dates:", error);
    }
};