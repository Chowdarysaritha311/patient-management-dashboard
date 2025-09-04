MediCare Hub - Patient Management Dashboard

Live Demo

Description

MediCare Hub is a comprehensive Patient Management Dashboard built with React and TailwindCSS. It allows healthcare providers to:

Add, edit, and delete patient records.

Search and filter patients by name or city.

Sort patients by name or email.

Paginate large patient lists for easier navigation.

View key statistics like total patients, active today, cities covered, and average response time.

Receive toast notifications for actions like adding, updating, or deleting patients.

The dashboard uses simulated API data and can easily integrate with a real backend.

Features

Responsive UI with Framer Motion animations.

Dynamic search and city filter.

Sorting and pagination.

Reusable components: PatientTable, PatientForm, SearchBar, Pagination, ToastContainer.

Form validation for patient input fields.

Toast notifications for success, error, info, and warning.

Tech Stack

Frontend: React, TailwindCSS, Framer Motion

Icons: Lucide React

State Management: React Hooks (useState, useEffect, useMemo, useCallback)

Screenshots

Sign In Page


Dashboard Overview


Add Patient Data


Installation

Clone the repository:

git clone https://github.com/yourusername/medi-care-hub.git
cd medi-care-hub


Install dependencies:

npm install


Start the development server:

npm start


The app will run on http://localhost:3000.

Usage

Sign In

Navigate to the sign-in page.

Enter your credentials to access the dashboard.

Upon successful login, you’ll be redirected to the main dashboard.

Add a Patient

Click on the Add Patient button.

Fill in the patient’s details (name, email, city, age, etc.).

Submit the form to save the patient. A success toast notification will confirm the addition.

Edit a Patient

Locate the patient in the table using search, filter, or pagination.

Click the Edit icon next to the patient’s entry.

Update the required information and submit the form. Changes will reflect instantly with a toast notification.

Delete a Patient

Find the patient in the table.

Click the Delete icon and confirm the action.

The patient record will be removed with a warning toast notification.

Search & Filter

Use the search bar to find patients by name or email.

Use the city filter dropdown to display patients from specific cities.

Sorting & Pagination

Click on the table headers (Name or Email) to sort patients ascending/descending.

Use pagination controls at the bottom to navigate through large patient lists.

Notifications

All actions (Add, Edit, Delete) trigger toast notifications for instant feedback.
