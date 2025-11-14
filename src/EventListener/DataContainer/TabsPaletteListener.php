<?php
namespace Lukasbableck\ContaoTabsBundle\EventListener\DataContainer;

use Contao\CoreBundle\DataContainer\PaletteManipulator;
use Contao\CoreBundle\DependencyInjection\Attribute\AsCallback;
use Contao\DataContainer;

#[AsCallback(table: 'tl_content', target: 'config.onpalette')]
class TabsPaletteListener {
	public function __invoke(string $palette, DataContainer $dc): string {
		$currentRecord = $dc->getCurrentRecord();

		if (!$currentRecord || 'tl_content' !== $currentRecord['ptable']) {
			return $palette;
		}

		$parentRecord = $dc->getCurrentRecord($currentRecord['pid'], 'tl_content');

		if (!$parentRecord || 'tabs' !== $parentRecord['type']) {
			return $palette;
		}

		$GLOBALS['TL_DCA']['tl_content']['fields']['sectionHeadline']['eval']['mandatory'] = true;

		return PaletteManipulator::create()
			->addLegend('section_legend', 'type_legend', PaletteManipulator::POSITION_BEFORE)
			->addField('sectionHeadline', 'section_legend', PaletteManipulator::POSITION_APPEND)
			->applyToString($palette)
		;
	}
}
