import {
  Box, Button, CheckBox, Form, FormField, Heading, Select, Text, TextArea,
} from 'grommet';
import styled from 'styled-components';
import React, { PureComponent, useEffect, useState } from 'react';
import _ from 'lodash';
import siteStore from '../../store/site.store';
import PageFrame from '../../views/PageFrame';
import makeArticleStore from './articleStore';

const CreateFrame = styled.article` {
  #create-content {
    textarea {
      min-height: 300px
    }
  }
}`;

class ChooseDir extends PureComponent {
  render() {
    const {
      onChange, name, value, options,
    } = this.props;

    return (
      <Select
        labelKey="title"
        value={value}
        onChange={({ option }) => {
          console.log('changing to ', option);
          onChange({ target: { value: option } });
        }}
        options={options}
        valueKey="directory"
      />
    );
  }
}

// @TODO: duplication warning

export default () => {
  const [value, setValue] = useState('');
  const [store, setStore] = useState('');
  const [errors, setErrors] = useState({});
  const [categories, setCats] = useState([]);

  // ---- import categories for use in the dropdown
  useEffect(() => {
    const sub = siteStore.subscribe((s) => {
      setCats(s.my.categories);
    });

    siteStore.do.loadCategories();
    return () => sub.unsubscribe();
  }, []);

  // ---- sync errors from store
  useEffect(() => {
    const articleStore = makeArticleStore();

    setValue(articleStore.value);
    setStore(articleStore);

    const sub = articleStore.subscribe((s) => {
      const err = {
        title: s.do.titleError(),
        content: s.do.contentError(),
        name: s.do.nameError(),
        directory: s.do.directoryError(),
      };

      setErrors(err);
    });
    return () => sub.unsubscribe();
  }, []);

  if (!(value && store && categories.length)) {
    return '';
  }

  return (

    <PageFrame>
      <CreateFrame>
        <Box background="rgba(255,255,255,0.8)" pad="medium" fill="both">
          <Form
            value={value}
            onChange={(v) => {
              setValue(v);
              store.do.update(v);
            }}
            onSubmit={store.do.submit}
            errors={errors}
          >
            <Heading>Create an Article</Heading>
            <Box>
              <Text weight="bold">Title</Text>
              <FormField name="title" />
            </Box>
            <Box>
              <Text weight="bold">Directory</Text>
              <FormField
                name="directory"
                options={categories}
                onChange={(e) => {
                  value.directory = e.target.value;
                  // / console.log('>>>> directory set to ', value.directory);
                  store.do.setDirectory(value.directory);
                }}
                component={ChooseDir}
              />
            </Box>
            <Box>
              <Text weight="bold">Name</Text>
              <FormField name="name" />
            </Box>
            <Box>
              <Text weight="bold">Published</Text>
              <FormField name="published" component={CheckBox} />
            </Box>
            <Box>
              <Text weight="bold">On Homepage</Text>
              <FormField name="onHomepage" component={CheckBox} />
            </Box>
            <Box>
              <Text weight="bold">Description</Text>
              <FormField name="description" component={TextArea} />
            </Box>
            <Box id="create-content">
              <Text weight="bold">Content</Text>
              <FormField name="content" component={TextArea} />
            </Box>
            <Button
              primary
              disabled={store.do.hasErrors()}
              type="submit"
              plain={false}
            >
              Create
            </Button>
          </Form>
        </Box>
      </CreateFrame>
    </PageFrame>
  );
};
