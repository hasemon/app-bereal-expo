import {StyleSheet, View} from "react-native";
import {Button, Column, Host, ModalBottomSheet, Text} from '@expo/ui/jetpack-compose';
import {paddingAll} from '@expo/ui/jetpack-compose/modifiers';
import {useState} from 'react';

export default function About() {

    const [visible, setVisible] = useState(false);

    return (
        <View style={styles.container}>
            <Text>Profile</Text>

            <Host matchContents>
                {/*<VStack>*/}
                <Button onPress={() => setVisible(true)}>Open Sheet</Button>
                {visible && (
                    <ModalBottomSheet onDismissRequest={() => setVisible(false)}>
                        <Column verticalArrangement={{spacedBy: 12}}
                                modifiers={[paddingAll(24)]}>
                            <Text>Hello from bottom sheet!</Text>
                            <Text>You can add more content here.</Text>
                            <Button onPress={() => setVisible(false)}>Close</Button>
                        </Column>
                    </ModalBottomSheet>
                )}
                {/*</VStack>*/}
            </Host>



        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
