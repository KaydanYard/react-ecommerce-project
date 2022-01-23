import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "react-query";
import { Grid, Menu, Input, Modal, Button, Icon } from "semantic-ui-react";
import { Company } from "../../components/company"
import API, { CompanyType } from "../../dataLayer/api"
import { useGlobalContext } from "../../contexts/global.context";

type ParamType = { id?: string }

type LoadersState = {
  connecting?: boolean;
  disconnecting?: boolean;
  fetching?: boolean;
}

export function CompaniesView() {
  const { id } = useParams<ParamType>()
  const { state: { loggedIn, user } } = useGlobalContext();
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [search, setSearch] = useState<string | undefined>()
  const [loaders, setLoaders] = useState<LoadersState>({})
  const navigate = useNavigate()

  const { data: companies } = useQuery(["companies"], async () => {
    const { data, status } = await API.getCompanies()
    return data
  })

  const { data: connectedCompanies, refetch: refetchConnectedCompanies } = useQuery(["connectedCompanies", user?.username], async () => {
    if (!user?.username) {
      return Promise.resolve([])
    }
    const { data, status } = await API.getConnectedCompanies(user?.username)
    return data || []
  })

  // Search Handler
  const handleSearch = ({ target: { value } }: any) => {
    setSearch(value);
  }

  // Companies
  const filteredCompanies = useMemo(() => {
    if (!search) {
      return companies;
    }
    const searchLowered = search?.toLowerCase();
    return companies?.filter((company) => JSON.stringify(Object.values(company)).toLowerCase().includes(searchLowered))
  }, [search, companies])

  const company = useMemo(() => {
    return companies?.find((company) => String(company.id) === id)
  }, [id, companies])

  // Company Selector
  const handleSelectCompany = (companyId: number) => () => {
    navigate(`/companies/${companyId}`)
  }

  // Connect Handler
  const handleConnect = async (company: CompanyType) => {
    if (!loggedIn) {
      setModalOpen(true)
    } else if (user?.username) {
      setLoaders({ connecting: true })
      await API.connectToCompany(user?.username, company.id);
      setLoaders({ fetching: true })
      await refetchConnectedCompanies()
      setLoaders({})
    }

  }

  const handleDisconnect = async (company: CompanyType) => {
    setLoaders({ connecting: true })
    await API.disconnectFromCompany(user?.username, company.id);
  }

  const closeModal = () => setModalOpen(false)

  const handleNavigate = (to: string) => () => {
    navigate(to)
  }

  return (
    <div>
      <Grid>
        <Grid.Column width={4}>
          <Input size="small" onChange={handleSearch} />

          <Menu vertical style={{ opacity: loaders.fetching ? '0.4' : '1' }}>
            {filteredCompanies?.map((company) => (
              <Menu.Item
                active={String(company.id) === id}
                key={company.id}
                onClick={handleSelectCompany(company.id)}
              >
                {connectedCompanies?.includes(company.id) && <Icon name="star" />} {company.name}
              </Menu.Item>)
            )}
          </Menu>
        </Grid.Column>

        <Grid.Column width={12}>
          {company ? (
            <Company
              company={company}
              connected={connectedCompanies?.includes(company.id)}
              onConnect={handleConnect}
              connecting={loaders.connecting}
              onDisconnect={handleDisconnect}
            />
          ) : (
            <h2>Please Select a Company</h2>
          )}
        </Grid.Column>
      </Grid>
      <Modal open={modalOpen} onClose={closeModal}>
        <Modal.Header>
          You Must Be Logged In
        </Modal.Header>
        <Modal.Content>
          Please Log In or Sign Up to Connect to a Company
        </Modal.Content>
        <Modal.Actions>
          <Button primary onClick={handleNavigate(`/sign-up?redirect=/companies/${id}`)}>Sign Up</Button>
          <Button primary onClick={handleNavigate(`/login?redirect=/companies/${id}`)}>Log In</Button>
          <Button secondary onClick={closeModal}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    </div >
  )
}