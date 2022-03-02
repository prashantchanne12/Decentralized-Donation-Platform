import factory from '../ethereum/factory';
import contract from '../ethereum/campaign';
import { useEffect, useState } from 'react';
import { Loader, Modal, Tabs } from '@mantine/core';
import { StatusOnlineIcon, StatusOfflineIcon } from '@heroicons/react/outline';

import Card from '../components/Card';
import DonationForm from '../components/DonationForm';

export default function Home({ campaigns }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState({});
  const [activeTab, setActiveTab] = useState('first');
  const onChange = (active, tabKey) => {
    setActiveTab(active);
  };
  const temp = campaigns;

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    setLoading(true);

    let items = await Promise.all(
      campaigns.map((id) => {
        let campaign = contract(id);
        return campaign.methods.getSummary().call();
      })
    );

    setLoading(false);
    setData(items);
  };

  if (loading) {
    return (
      <div className='my-40 flex justify-center items-center'>
        <Loader color='violet' />
      </div>
    );
  } else if (!loading && data.length === 0) {
    return <div>No data found!!</div>;
  }

  return (
    <>
      <div className='max-w-5xl mx-auto p-2'>
        <Tabs active={activeTab} onTabChange={onChange}>
          <Tabs.Tab
            label='Active Campaigns'
            tabKey='first'
            icon={<StatusOnlineIcon className='w-6 h-6' />}
          >
            <Modal
              opened={opened}
              onClose={() => setOpened(false)}
              title='Donate now'
            >
              <DonationForm
                minDonation={selected.minDonation}
                address={selected.address}
                setOpened={setOpened}
              />
            </Modal>

            <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-5'>
              {data.map(
                (item, index) =>
                  !item[6] && (
                    <Card
                      id={temp[index]}
                      key={index}
                      title={item[0]}
                      description={item[1]}
                      donated={item[2]}
                      totalDoners={item[3]}
                      minDonation={item[4]}
                      goal={item[5]}
                      complete={item[6]}
                      endAt={item[7]}
                      image={item[8]}
                      setOpened={setOpened}
                      setSelected={setSelected}
                    />
                  )
              )}
            </div>

            {/* <Button
              variant='outline'
              onClick={() =>
                notifications.showNotification({
                  title: 'Install Metamask',
                  message:
                    "Install Metamask browser extension if you have't already",
                })
              }
            >
              Show notification
            </Button> */}
          </Tabs.Tab>
          <Tabs.Tab
            label='Closed Campaigns'
            tabKey='second'
            icon={<StatusOfflineIcon className='w-6 h-6' />}
          >
            <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-5'>
              {data.map(
                (item, index) =>
                  item[6] && (
                    <Card
                      id={temp[index]}
                      key={index}
                      title={item[0]}
                      description={item[1]}
                      donated={item[2]}
                      totalDoners={item[3]}
                      minDonation={item[4]}
                      goal={item[5]}
                      complete={item[6]}
                      endAt={item[7]}
                      image={item[8]}
                      setOpened={setOpened}
                      setSelected={setSelected}
                    />
                  )
              )}
            </div>
          </Tabs.Tab>
        </Tabs>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const campaigns = await factory.methods.getDeployedCampaigns().call();

  return { props: { campaigns } };
}
