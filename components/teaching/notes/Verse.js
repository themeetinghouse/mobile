import React from 'react';
import { View, Right, Thumbnail } from 'native-base';
import Theme, { Style } from '../../../Theme.style';
import { TouchableOpacity, Text } from 'react-native';

const xml2js = require('react-native-xml2js');
const parser = new xml2js.Parser({ explicitChildren: true, preserveChildrenOrder: true, charsAsChildren: true})

const style = {
    verseContainer: {
        borderRadius: 4,
        borderColor: Theme.colors.gray3,
        borderWidth: 1,
    },
    verseTitleContainer: {
       backgroundColor: Theme.colors.gray3,
       borderTopLeftRadius: 3,
       borderTopRightRadius: 3,
       flexDirection: "row",
       alignItems: "center",
       paddingRight: 8
    },
    verseTitle: {
        fontFamily: Theme.fonts.fontFamilyRegular,
        color: Theme.colors.white,
        lineHeight: 32,
        paddingLeft: Theme.fonts.small,
        fontSize: Theme.fonts.medium,
        flexGrow: 1,
    },
    verseContentContainer: {
        fontFamily: Theme.fonts.fontFamilyRegular,
        color: Theme.colors.white,
        padding: Theme.fonts.small,
        lineHeight: Theme.fonts.large,
        fontSize: Theme.fonts.medium
    },
    verseContent: {
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: Theme.fonts.medium,
        color: Theme.colors.white,
        lineHeight: 24,
    },
    verseNumber: {
        fontFamily: Theme.fonts.fontFamilyRegular,
        color: Theme.colors.gray4,
        fontSize: Theme.fonts.small,
        marginLeft: 5,
    },
    chapterNumber: {
        fontFamily: Theme.fonts.fontFamilyBold,
        color: Theme.colors.gray4,
        fontSize: Theme.fonts.medium,
    },
    sectionHeading: {
        fontFamily: Theme.fonts.fontFamilyBold,
        color: Theme.colors.white,
        fontSize: Theme.fonts.medium,
    },
    newWindowIcon: {
        width: 18,
        height: 18,
        marginRight: 10,
    }
}

export default function Verse({note, verse, containerStyle, onClosePressed}){

    let verseContent = null;
    parser.parseString(`<root>${verse.content}</root>`, (err, result) => {
        if (!err){
            verseContent = result;
        }
    });

    const pruneVerseTree = (node) => {
        if (node.$$){
            const children = [];
            for (let child of node.$$){
                children.push(pruneVerseTree(child));
            }
            return {$$: children, $: node.$, '#name': node['#name']};
        } else {
            return node;
        }
    }

    const prunedVerseContent = pruneVerseTree(verseContent.root);
    console.log("prunedVerseContent = ", JSON.stringify(prunedVerseContent, null, 2));

    // Function to recursively iterate down an HTML tree, creating the JSX representation of the nodes
    const processVerseContent = (node) => {
        let childrenJSX = [];
        if (node.$$){
            for (let child of node.$$){
                let thisVerseContent = processVerseContent(child);
                if (thisVerseContent){
                    childrenJSX.push(thisVerseContent);                    
                }
            }
        }
        let classes = (node.$ && node.$.class ? node.$.class.split(" ") : []);
        if (classes.includes("p")){
            return <Text style={style.verseContent}>{childrenJSX}</Text>
        } else if (classes.includes("s")){
            return <Text style={style.sectionHeading}>{childrenJSX}</Text>
        } else if (classes.includes("text")){
            return <Text>{childrenJSX}</Text>
        } else if (classes.includes("v")){
            return <Text style={style.verseNumber}>  {childrenJSX} </Text>
        } else if (classes.includes("chapternum")){
            return <Text style={style.chapterNumber}>  {childrenJSX} </Text>
        } else if (node['#name'] === '__text__'){
            return <Text>{node['_']}</Text>
        } else {
            return <Text>{childrenJSX}</Text>;
        }

    }
    
    const verseContentJSX = processVerseContent(prunedVerseContent);     
    //const verseContentJSX = <></>

    return (
        <View style={[style.verseContainer, containerStyle]}>
            <View style={style.verseTitleContainer}>
                <Text style={style.verseTitle}>{verse.chapterVerse}</Text>
                {/* <TouchableOpacity>
                    <Thumbnail style={[Style.icon, style.newWindowIcon]} square source={Theme.icons.white.newWindow}/>
                </TouchableOpacity> */}
                <TouchableOpacity  onPress={() => onClosePressed({note: note, verseId: verse.id, chapterVerse: verse.chapterVerse})}>
                    <Thumbnail style={Style.icon} square source={Theme.icons.white.closeCancel}/>
                </TouchableOpacity>
            </View>
            <View style={style.verseContentContainer}>
                <Text style={style.verseContent}>
                    {verseContentJSX}
                </Text>
            </View>
        </View>
    )
}