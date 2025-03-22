import { Container, Tab, Tabs } from "react-bootstrap";
import CreateQuote from "./components/CreateQuote";
import QuotesList from "./components/QuotesList";
import { useState } from "react";
import EditQuote from "./components/EditQuote";

function App() {

  const [activeTab, setActiveTab] = useState<string>('list');
  const [quoteToEdit, setQuoteToEdit] = useState<{id: number, quote: string, author: string}|null>(null);

  const triggerEdit = (quote: {id: number, quote: string, author: string}) => {
    setQuoteToEdit(quote);
    setActiveTab('edit');
  }

  const onTabSelect = (k: string|null) => {
    if(k !== 'edit')
      setQuoteToEdit(null)
    setActiveTab(k as unknown as string)
  }

  return (
    <Container className="mt-4" style={{display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 700}}>
      <Tabs defaultActiveKey="list" id="quotes-tabs" className="mb-3" activeKey={activeTab} onSelect={onTabSelect}>
        <Tab eventKey="list" title="Quotes List">
          <QuotesList onEdit={triggerEdit} />
        </Tab>
        <Tab eventKey="create" title="Create Quote">
          <CreateQuote />
        </Tab>
        { quoteToEdit && (
          <Tab eventKey="edit" title="Edit Quote">
             <EditQuote quoteToEdit={quoteToEdit} onClose={() => {onTabSelect('list')}} />
          </Tab>
        )}
      </Tabs>
    </Container>
  )
}

export default App
