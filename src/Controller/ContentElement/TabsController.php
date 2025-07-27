<?php
namespace Lukasbableck\ContaoTabsBundle\Controller\ContentElement;

use Contao\ContentModel;
use Contao\CoreBundle\Controller\ContentElement\AbstractContentElementController;
use Contao\CoreBundle\DependencyInjection\Attribute\AsContentElement;
use Contao\CoreBundle\Framework\ContaoFramework;
use Contao\CoreBundle\Twig\FragmentTemplate;
use Contao\StringUtil;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[AsContentElement(self::TYPE, category: 'miscellaneous', nestedFragments: true)]
class TabsController extends AbstractContentElementController {
	public const TYPE = 'tabs';

	public function __construct(private readonly ContaoFramework $framework) {
	}

	protected function getResponse(FragmentTemplate $template, ContentModel $model, Request $request): Response {
		$elements = [];

		/** @var ContentElementReference $reference */
		foreach ($template->get('nested_fragments') as $i => $reference) {
			$nestedModel = $reference->getContentModel();

			if (!$nestedModel instanceof ContentModel) {
				$nestedModel = $this->framework->getAdapter(ContentModel::class)->findById($nestedModel);
			}

			$header = StringUtil::deserialize($nestedModel->sectionHeadline, true);

			$elements[] = [
				'header' => $header['value'] ?? '',
				'header_tag' => $header['unit'] ?? 'h2',
				'reference' => $reference,
			];
		}

		$template->set('elements', $elements);

		return $template->getResponse();
	}
}
