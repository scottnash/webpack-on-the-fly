window.modules["379"] = [function(require,module,exports){var data = require(374);

module.exports = require(453).create({
    generic: true,
    types: data.types,
    properties: data.properties,

    parseContext: {
        default: 'StyleSheet',
        stylesheet: 'StyleSheet',
        atrule: 'Atrule',
        atruleExpression: function(options) {
            return this.AtruleExpression(options.atrule ? String(options.atrule) : null);
        },
        mediaQueryList: 'MediaQueryList',
        mediaQuery: 'MediaQuery',
        rule: 'Rule',
        selectorList: 'SelectorList',
        selector: 'Selector',
        block: function() {
            return this.Block(this.Declaration);
        },
        declarationList: 'DeclarationList',
        declaration: 'Declaration',
        value: function(options) {
            return this.Value(options.property ? String(options.property) : null);
        }
    },
    scope: {
        AtruleExpression: require(432),
        Selector: require(431),
        Value: require(446)
    },
    atrule: {
        'font-face': require(395),
        'import': require(396),
        'media': require(397),
        'page': require(398),
        'supports': require(399)
    },
    pseudo: {
        'dir': require(442),
        'has': require(443),
        'lang': require(444),
        'matches': require(449),
        'not': require(452),
        'nth-child': require(448),
        'nth-last-child': require(451),
        'nth-last-of-type': require(450),
        'nth-of-type': require(447),
        'slotted': require(445)
    },
    node: {
        AnPlusB: require(417),
        Atrule: require(416),
        AtruleExpression: require(433),
        AttributeSelector: require(418),
        Block: require(440),
        Brackets: require(419),
        CDC: require(421),
        CDO: require(423),
        ClassSelector: require(420),
        Combinator: require(424),
        Comment: require(422),
        Declaration: require(425),
        DeclarationList: require(441),
        Dimension: require(428),
        Function: require(426),
        HexColor: require(429),
        Identifier: require(430),
        IdSelector: require(427),
        MediaFeature: require(403),
        MediaQuery: require(434),
        MediaQueryList: require(435),
        Nth: require(401),
        Number: require(404),
        Operator: require(402),
        Parentheses: require(405),
        Percentage: require(406),
        PseudoClassSelector: require(436),
        PseudoElementSelector: require(437),
        Ratio: require(408),
        Raw: require(407),
        Rule: require(409),
        Selector: require(400),
        SelectorList: require(438),
        String: require(410),
        StyleSheet: require(439),
        TypeSelector: require(411),
        UnicodeRange: require(412),
        Url: require(415),
        Value: require(413),
        WhiteSpace: require(414)
    }
});
}, {"374":374,"395":395,"396":396,"397":397,"398":398,"399":399,"400":400,"401":401,"402":402,"403":403,"404":404,"405":405,"406":406,"407":407,"408":408,"409":409,"410":410,"411":411,"412":412,"413":413,"414":414,"415":415,"416":416,"417":417,"418":418,"419":419,"420":420,"421":421,"422":422,"423":423,"424":424,"425":425,"426":426,"427":427,"428":428,"429":429,"430":430,"431":431,"432":432,"433":433,"434":434,"435":435,"436":436,"437":437,"438":438,"439":439,"440":440,"441":441,"442":442,"443":443,"444":444,"445":445,"446":446,"447":447,"448":448,"449":449,"450":450,"451":451,"452":452,"453":453}];
